import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

import { User } from '../../../../interfaces/user';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { PageService } from '../../../../services/page/page.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
})
export class AdminAccountComponent {
  loggedUser?: User;
  targetPage?: Page;
  openPageOptionsModal?: boolean;
  selectedPage?: Page;
  changePageUrlForm: FormGroup;
  changePageUrlForm_submitFeedbackMessage?: string;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private pageService: PageService,
    private fb: FormBuilder
  ) {
    this.changePageUrlForm = this.fb.group({
      url: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
          this.characterPatternValidator,
          this.noDotAtEdgesValidator,
        ],
      ],
    });
  }

  characterPatternValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const url = control.value;
    const pattern = /^[a-zA-Z0-9_.]+$/;
    if (url && !pattern.test(url)) {
      return { invalidCharacterPattern: true };
    }
    return null;
  }

  noDotAtEdgesValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const url = control.value;

    if (url && (url.startsWith('.') || url.endsWith('.'))) {
      return { invalidDotAtEdges: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.loggedUser$.subscribe((user) => {
        console.log(user);
        this.loggedUser = user;
      })
    );
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        console.log(page);
        this.targetPage = page;
      })
    );
  }

  onOpenPageOptionsModal(page: Page) {
    if (this.changePageUrlForm_submitFeedbackMessage) {
      this.changePageUrlForm_submitFeedbackMessage = undefined;
    }
    this.selectedPage = page;
    this.changePageUrlForm.setValue({
      url: page.url,
    });
    this.openPageOptionsModal = true;
  }

  onChangePageUrlFormSubmit() {
    this.disableForm = true;

    const pageId = this.selectedPage!.id;

    const requestBody: any = {
      url: this.changePageUrlForm.value.url,
    };

    this.subscription.add(
      this.pageService.updatePage(pageId, requestBody).subscribe({
        next: (response: any) => {
          const pageIndex = this.loggedUser!.pages!.findIndex(
            (page) => page.id === pageId
          );
          this.loggedUser!.pages![pageIndex] = response.data;

          if (pageId == this.targetPage!.id) {
            this.userService.setTargetPage(response.data);
          }

          this.disableForm = false;
          this.openPageOptionsModal = false;
        },
        error: (event) => {
          this.changePageUrlForm_submitFeedbackMessage = event.error.message;
          this.disableForm = false;
        },
      })
    );
  }

  switchPage() {
    this.openPageOptionsModal = false;
    this.userService.setTargetPage(this.selectedPage);
  }

  deletePage() {
    this.disableForm = true;
    const pageId = this.selectedPage!.id;

    this.subscription.add(
      this.pageService.deletePage(pageId).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(response.data);
          this.userService.setTargetPage(response.data.pages[0]);
          this.disableForm = false;
          this.openPageOptionsModal = false;
        },
        error: (event) => {},
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
