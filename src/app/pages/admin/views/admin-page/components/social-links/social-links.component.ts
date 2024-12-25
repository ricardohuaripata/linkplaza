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
import { SocialPlatform } from '../../../../../../interfaces/social-platform';
import { PageService } from '../../../../../../services/page/page.service';
import { SocialLink } from '../../../../../../interfaces/social-link';
import { UserService } from '../../../../../../services/user/user.service';
import { urlValidator } from '../../../../../../validators/url-validators';
import { LoadingComponent } from "../../../../../../shared/loading/loading.component";

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, LoadingComponent],
  templateUrl: './social-links.component.html',
  styleUrl: './social-links.component.scss',
})
export class SocialLinksComponent implements OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;
  disableAddSocialLinkForm: boolean = false;
  disableEditSocialLinkForm: boolean = false;
  disableRemoveSocialLinkButton: boolean = false;

  addSocialLinkForm: FormGroup;
  editSocialLinkForm: FormGroup;

  openAddSocialLinkModal: boolean = false;
  openEditSocialLinkModal: boolean = false;

  addSocialLinkFormSubmitFeedbackMessage?: string;

  socialPlatforms?: SocialPlatform[];

  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.addSocialLinkForm = this.fb.group({
      socialPlatform: [null, [Validators.required]],
      url: [
        '',
        [Validators.required, Validators.maxLength(3200), urlValidator],
      ],
    });

    this.editSocialLinkForm = this.fb.group({
      socialLink: [null, [Validators.required]],
      url: ['', [Validators.maxLength(3200), urlValidator]],
    });
  }

  onOpenAddSocialLinkModal() {
    this.openAddSocialLinkModal = true;

    if (!this.socialPlatforms) {
      this.subscription.add(
        this.pageService.getSocialPlatforms().subscribe({
          next: (response: any) => {
            this.socialPlatforms = response.data;
          },
          error: (event) => {},
        })
      );
    }
  }

  onOpenEditSocialLinkModal(socialLink: SocialLink) {
    this.editSocialLinkForm.setValue({
      socialLink: socialLink,
      url: socialLink.url,
    });
    this.openEditSocialLinkModal = true;
  }

  onAddSocialLinkFormSubmit(pageId: number) {
    this.disableForm = true;
    this.disableAddSocialLinkForm = true;

    const requestBody: any = {
      socialPlatformId: this.addSocialLinkForm.value.socialPlatform.id,
      url: this.addSocialLinkForm.value.url,
    };

    this.subscription.add(
      this.pageService.addSocialLink(pageId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.disableAddSocialLinkForm = false;
          this.openAddSocialLinkModal = false;
          this.addSocialLinkForm.get('socialPlatform')?.setValue(null);
          this.addSocialLinkForm.get('url')?.setValue('');
          if (this.addSocialLinkFormSubmitFeedbackMessage) {
            this.addSocialLinkFormSubmitFeedbackMessage = undefined;
          }
        },
        error: (event) => {
          this.addSocialLinkFormSubmitFeedbackMessage = event.error.message;
          this.disableForm = false;
          this.disableAddSocialLinkForm = false;

        },
      })
    );
  }

  onEditSocialLinkFormSubmit() {
    this.disableForm = true;
    this.disableEditSocialLinkForm = true;

    const socialLinkId = this.editSocialLinkForm.value.socialLink.id;

    const requestBody: any = {
      url: this.editSocialLinkForm.value.url,
    };

    this.subscription.add(
      this.pageService.updateSocialLink(socialLinkId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.disableEditSocialLinkForm = false;
          this.openEditSocialLinkModal = false;
        },
        error: (event) => {
          this.disableForm = false;
          this.disableEditSocialLinkForm = false;
        },
      })
    );
  }

  toggleSocialLinkActiveStatus(socialLink: SocialLink) {
    this.disableForm = true;

    const requestBody: any = {
      active: !socialLink.active,
    };

    this.subscription.add(
      this.pageService.updateSocialLink(socialLink.id, requestBody).subscribe({
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

  setSocialLinkPosition(page: Page, socialLink: SocialLink, event: Event) {
    this.disableForm = true;

    const selectedIndex = (event.target as HTMLSelectElement).value;
    let idsBefore: number[] = [];
    let idsAfter: number[] = [];

    for (let i = 0; i < page.socialLinks!.length; i++) {
      idsBefore.push(page.socialLinks![i].id);
      idsAfter.push(page.socialLinks![i].id);
    }

    let a = idsBefore.indexOf(socialLink.id);
    let b = idsBefore[parseInt(selectedIndex)];

    idsAfter[a] = b;
    idsAfter[parseInt(selectedIndex)] = socialLink.id;

    const requestBody: any = {
      ids: idsAfter,
    };

    this.subscription.add(
      this.pageService.sortSocialLinks(page.id, requestBody).subscribe({
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

  removeSocialLink() {
    this.disableForm = true;
    this.disableRemoveSocialLinkButton = true;

    const socialLinkId = this.editSocialLinkForm.value.socialLink.id;

    this.subscription.add(
      this.pageService.deleteSocialLink(socialLinkId).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.disableRemoveSocialLinkButton = false;
          this.openEditSocialLinkModal = false;
        },
        error: (event) => {
          this.disableForm = false;
          this.disableRemoveSocialLinkButton = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
