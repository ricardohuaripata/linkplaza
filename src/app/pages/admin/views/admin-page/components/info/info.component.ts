import { NgClass } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Page } from '../../../../../../interfaces/page';
import { PageService } from '../../../../../../services/page/page.service';
import { UserService } from '../../../../../../services/user/user.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit, OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;

  openEditPageModal: boolean = false;
  editPageForm: FormGroup;

  editPageFormSubmitFeedbackMessage?: string;

  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.editPageForm = this.fb.group({
      title: ['', Validators.maxLength(32)],
      bio: ['', Validators.maxLength(256)],
      pictureUrl: ['', Validators.maxLength(3200)],
    });
  }

  ngOnInit(): void {
    this.editPageForm.setValue({
      title: this.page?.title,
      bio: this.page?.bio,
      pictureUrl: this.page?.pictureUrl,
    });
  }

  onEditPageFormSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      title: this.editPageForm.value.title,
      bio: this.editPageForm.value.bio,
      pictureUrl: this.editPageForm.value.pictureUrl,
    };

    this.subscription.add(
      this.pageService.updatePage(this.page.id, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openEditPageModal = false;
        },
        error: (event) => {
          this.editPageFormSubmitFeedbackMessage = event.error.message;
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
