import { Component, Input, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';

import { Page } from '../../../../../../interfaces/page';
import { PageService } from '../../../../../../services/page/page.service';
import { CustomLink } from '../../../../../../interfaces/custom-link';
import { UserService } from '../../../../../../services/user/user.service';
import { urlValidator } from '../../../../../../validators/url-validators';

@Component({
  selector: 'app-custom-links',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './custom-links.component.html',
  styleUrl: './custom-links.component.scss',
})
export class CustomLinksComponent implements OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;

  addCustomLinkForm: FormGroup;
  editCustomLinkForm: FormGroup;

  openAddCustomLinkModal: boolean = false;
  openEditCustomLinkModal: boolean = false;

  addCustomLinkFormSubmitFeedbackMessage?: string;

  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.addCustomLinkForm = this.fb.group({
      url: [
        '',
        [Validators.required, Validators.maxLength(3200), urlValidator],
      ],
      title: ['', [Validators.required, Validators.maxLength(128)]],
    });

    this.editCustomLinkForm = this.fb.group({
      customLink: [null, [Validators.required]],
      url: ['', [Validators.maxLength(3200), urlValidator]],
      title: ['', [Validators.maxLength(128)]],
    });
  }

  onOpenEditCustomLinkModal(customLink: CustomLink) {
    this.editCustomLinkForm.setValue({
      customLink: customLink,
      url: customLink.url,
      title: customLink.title,
    });
    this.openEditCustomLinkModal = true;
  }

  onAddCustomLinkFormSubmit(pageId: number) {
    this.disableForm = true;

    let url = this.addCustomLinkForm.value.url;

    // añadir "http://" si no se especifica "http://" o "https://"
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }

    const requestBody: any = {
      url: url,
      title: this.addCustomLinkForm.value.title,
    };

    this.subscription.add(
      this.pageService.addCustomLink(pageId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openAddCustomLinkModal = false;
          this.addCustomLinkForm.get('url')?.setValue('');
          this.addCustomLinkForm.get('title')?.setValue('');
          if (this.addCustomLinkFormSubmitFeedbackMessage) {
            this.addCustomLinkFormSubmitFeedbackMessage = undefined;
          }
        },
        error: (event) => {
          this.addCustomLinkFormSubmitFeedbackMessage = event.error.message;
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
        },
      })
    );
  }

  onEditCustomLinkFormSubmit() {
    this.disableForm = true;

    const customLinkId = this.editCustomLinkForm.value.customLink.id;

    const requestBody: any = {
      url: this.editCustomLinkForm.value.url,
      title: this.editCustomLinkForm.value.title,
    };

    this.subscription.add(
      this.pageService.updateCustomLink(customLinkId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openEditCustomLinkModal = false;
        },
        error: (event) => {
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
        },
      })
    );
  }

  toggleCustomLinkActiveStatus(customLink: CustomLink) {
    this.disableForm = true;

    const requestBody: any = {
      active: !customLink.active,
    };

    this.subscription.add(
      this.pageService.updateCustomLink(customLink.id, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  setCustomLinkPosition(page: Page, customLink: CustomLink, event: Event) {
    this.disableForm = true;

    const selectedIndex = (event.target as HTMLSelectElement).value;
    let idsBefore: number[] = [];
    let idsAfter: number[] = [];

    for (let i = 0; i < page.customLinks!.length; i++) {
      idsBefore.push(page.customLinks![i].id);
      idsAfter.push(page.customLinks![i].id);
    }

    let a = idsBefore.indexOf(customLink.id);
    let b = idsBefore[parseInt(selectedIndex)];

    idsAfter[a] = b;
    idsAfter[parseInt(selectedIndex)] = customLink.id;

    const requestBody: any = {
      ids: idsAfter,
    };

    this.subscription.add(
      this.pageService.sortCustomLinks(page.id, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  removeCustomLink() {
    this.disableForm = true;

    const customLinkId = this.editCustomLinkForm.value.customLink.id;

    this.subscription.add(
      this.pageService.deleteCustomLink(customLinkId).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openEditCustomLinkModal = false;
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
