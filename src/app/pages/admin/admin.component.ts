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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageService } from '../../services/page/page.service';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { CustomLinksComponent } from './components/custom-links/custom-links.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SocialLinksComponent,
    CustomLinksComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  authUser?: User;
  targetPage?: Page;
  openEditPageModal: boolean = false;
  editPageForm: FormGroup;
  disableForm: boolean = false;
  editPageFormSubmitFeedbackMessage?: string;

  constructor(
    private userService: UserService,
    private pageService: PageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editPageForm = this.fb.group({
      title: ['', Validators.maxLength(32)],
      bio: ['', Validators.maxLength(256)],
      pictureUrl: ['', Validators.maxLength(3200)],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription.add(
        this.userService.getUserInfo().subscribe({
          next: (response: any) => {
            console.log(response);
            this.authUser = response.data;
            this.targetPage = response.data.pages[0];

            if (this.targetPage) {
              this.editPageForm.setValue({
                title: this.targetPage?.title,
                bio: this.targetPage?.bio,
                pictureUrl: this.targetPage?.pictureUrl,
              });
            } else {
              this.router.navigate(['/new-page']);
            }
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
          this.targetPage = response.data;
          this.disableForm = false;
          this.openEditPageModal = false;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
