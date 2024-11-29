import { Component, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
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

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './social-links.component.html',
  styleUrl: './social-links.component.scss',
})
export class SocialLinksComponent implements OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;

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
        [Validators.required, Validators.maxLength(3200), this.urlValidator],
      ],
    });

    this.editSocialLinkForm = this.fb.group({
      socialLink: [null, [Validators.required]],
      url: ['', [Validators.maxLength(3200), this.urlValidator]],
    });
  }

  urlValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const url = control.value;
    if (url && url.trim() !== url) {
      return { invalidUrl: true };
    }
    return null;
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

    const requestBody: any = {
      socialPlatformId: this.addSocialLinkForm.value.socialPlatform.id,
      url: this.addSocialLinkForm.value.url,
    };

    this.subscription.add(
      this.pageService.addSocialLink(pageId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openAddSocialLinkModal = false;
          this.addSocialLinkForm.get('socialPlatform')?.setValue(null);
          this.addSocialLinkForm.get('url')?.setValue('');
          if (this.addSocialLinkFormSubmitFeedbackMessage) {
            this.addSocialLinkFormSubmitFeedbackMessage = undefined;
          }
        },
        error: (event) => {
          this.addSocialLinkFormSubmitFeedbackMessage = event.error.message;
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
        },
      })
    );
  }

  onEditSocialLinkFormSubmit() {
    this.disableForm = true;

    const socialLinkId = this.editSocialLinkForm.value.socialLink.id;

    const requestBody: any = {
      url: this.editSocialLinkForm.value.url,
    };

    this.subscription.add(
      this.pageService.updateSocialLink(socialLinkId, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openEditSocialLinkModal = false;
        },
        error: (event) => {
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
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

    const socialLinkId = this.editSocialLinkForm.value.socialLink.id;

    this.subscription.add(
      this.pageService.deleteSocialLink(socialLinkId).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableForm = false;
          this.openEditSocialLinkModal = false;
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
