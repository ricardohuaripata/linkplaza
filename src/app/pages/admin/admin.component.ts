import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { User } from '../../interfaces/user';
import { Page } from '../../interfaces/page';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageService } from '../../services/page/page.service';
import { SocialLink } from '../../interfaces/social-link';
import { SocialPlatform } from '../../interfaces/social-platform';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  authUser?: User;
  targetPage?: Page;
  openEditPageModal: boolean = false;
  openAddSocialLinkModal: boolean = false;
  editPageForm: FormGroup;
  addSocialLinkForm: FormGroup;
  disableForm: boolean = false;
  editPageFormSubmitFeedbackMessage?: string;
  addSocialLinkFormSubmitFeedbackMessage?: string;
  loading: boolean = false;
  socialPlatforms?: SocialPlatform[];

  constructor(
    private userService: UserService,
    private pageService: PageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {
    this.editPageForm = this.fb.group({
      title: ['', Validators.maxLength(32)],
      bio: ['', Validators.maxLength(256)],
      pictureUrl: ['', Validators.maxLength(3200)],
    });

    this.addSocialLinkForm = this.fb.group({
      socialPlatform: [null, [Validators.required]],
      url: [
        '',
        [Validators.required, Validators.maxLength(3200), this.urlValidator],
      ],
    });
  }

  urlValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const url = control.value;
    if (url && url.trim() !== url) {
      return { invalidUrl: true };
    }
    return null;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription.add(
        this.userService.getUserInfo().subscribe({
          next: (response: any) => {
            console.log(response);
            this.authUser = response.data;
            this.targetPage = response.data.pages[0];

            this.editPageForm.setValue({
              title: this.targetPage?.title,
              bio: this.targetPage?.bio,
              pictureUrl: this.targetPage?.pictureUrl,
            });
          },
          error: (event) => {},
        })
      );
    }
  }

  onEditPageFormSubmit(id: number) {
    this.disableForm = true;

    const requestBody: any = {
      title: this.editPageForm.value.title,
      bio: this.editPageForm.value.bio,
      pictureUrl: this.editPageForm.value.pictureUrl,
    };

    this.subscription.add(
      this.pageService.updatePage(id, requestBody).subscribe({
        next: (response: any) => {
          this.disableForm = false;
          this.openEditPageModal = false;
          this.targetPage = response.data;
        },
        error: (event) => {
          this.editPageFormSubmitFeedbackMessage = event.error.message;
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
        },
      })
    );
  }

  onOpenAddSocialLinkModal() {
    this.openAddSocialLinkModal = true;

    if (!this.socialPlatforms) {
      this.subscription.add(
        this.pageService.getSocialPlatforms().subscribe({
          next: (response: any) => {
            this.socialPlatforms = response.data;
            console.log(this.socialPlatforms);
          },
          error: (event) => {},
        })
      );
    }
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
          this.disableForm = false;
          this.openAddSocialLinkModal = false;
          this.targetPage = response.data;
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

  toggleSocialLinkActiveStatus(socialLink: SocialLink) {
    this.disableForm = true;

    const requestBody: any = {
      active: !socialLink.active,
    };

    this.subscription.add(
      this.pageService.updateSocialLink(socialLink.id, requestBody).subscribe({
        next: (response: any) => {
          this.targetPage = response.data;
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
    this.loading = true;

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
          this.targetPage = response.data;
          this.disableForm = false;
          this.loading = false;
        },
        error: (event) => {
          this.disableForm = false;
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
