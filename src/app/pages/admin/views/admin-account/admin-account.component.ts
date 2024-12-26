import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  characterPatternValidator,
  noDotAtEdgesValidator,
} from '../../../../validators/url-validators';
import {
  emailValidator,
  passwordValidator,
} from '../../../../validators/user-validators';

import { User } from '../../../../interfaces/user';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { PageService } from '../../../../services/page/page.service';
import { LoadingComponent } from '../../../../shared/loading/loading.component';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
})
export class AdminAccountComponent implements OnInit, OnDestroy {
  loggedUser?: User;
  targetPage?: Page;
  selectedPage?: Page;

  openPageOptionsModal?: boolean;
  openDeleteAccountWarningModal?: boolean;
  openDeleteAccountVerificationModal?: boolean;
  openAccountVerificationModal?: boolean;
  openChangePasswordModal?: boolean;

  changeEmailForm: FormGroup;
  changePageUrlForm: FormGroup;
  changePasswordForm: FormGroup;
  deleteAccountVerificationForm: FormGroup;
  accountVerificationForm: FormGroup;

  changeEmailForm_submitFeedbackMessage?: string;
  changePageUrlForm_submitFeedbackMessage?: string;
  changePasswordForm_submitFeedbackMessage?: string;
  deleteAccountVerificationForm_submitFeedbackMessage?: string;
  accountVerificationForm_submitFeedbackMessage?: string;

  disableForm: boolean = false;
  disableChangeEmailForm: boolean = false;
  disableChangePageUrlForm: boolean = false;
  disableChangePasswordForm: boolean = false;
  disableDeletePageButton: boolean = false;
  disableDeleteAccountForm: boolean = false;
  disableVerifyAccountForm: boolean = false;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  resendCodeCooldown: boolean = false;
  resendCodeCooldownRemainingTime: number = 20;

  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private pageService: PageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.changeEmailForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
    });
    this.changePageUrlForm = this.fb.group({
      url: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
          characterPatternValidator,
          noDotAtEdgesValidator,
        ],
      ],
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(256),
          passwordValidator,
        ],
      ],
    });
    this.deleteAccountVerificationForm = this.fb.group({
      digit1: ['', [Validators.required]],
      digit2: ['', [Validators.required]],
      digit3: ['', [Validators.required]],
      digit4: ['', [Validators.required]],
      digit5: ['', [Validators.required]],
      digit6: ['', [Validators.required]],
    });
    this.accountVerificationForm = this.fb.group({
      digit1: ['', [Validators.required]],
      digit2: ['', [Validators.required]],
      digit3: ['', [Validators.required]],
      digit4: ['', [Validators.required]],
      digit5: ['', [Validators.required]],
      digit6: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.loggedUser$.subscribe((user) => {
        this.loggedUser = user;
        this.changeEmailForm.setValue({
          email: user?.email,
        });
      })
    );
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        this.targetPage = page;
      })
    );
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
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

  onChangeEmailFormSubmit() {
    this.disableForm = true;
    this.disableChangeEmailForm = true;

    const requestBody: any = {
      email: this.changeEmailForm.value.email,
    };

    this.subscription.add(
      this.userService.changeEmail(requestBody).subscribe({
        next: (response: any) => {
          if (this.changeEmailForm_submitFeedbackMessage) {
            this.changeEmailForm_submitFeedbackMessage = undefined;
          }
          this.userService.setLoggedUser(response.data);
          this.disableForm = false;
          this.disableChangeEmailForm = false;
        },
        error: (event) => {
          this.changeEmailForm_submitFeedbackMessage = event.error.message;
          this.disableForm = false;
          this.disableChangeEmailForm = false;
        },
      })
    );
  }

  onChangePageUrlFormSubmit() {
    this.disableForm = true;
    this.disableChangePageUrlForm = true;

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
          this.disableChangePageUrlForm = false;
          this.openPageOptionsModal = false;
        },
        error: (event) => {
          this.changePageUrlForm_submitFeedbackMessage = event.error.message;
          this.disableForm = false;
          this.disableChangePageUrlForm = false;
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
    this.disableDeletePageButton = true;

    const pageId = this.selectedPage!.id;

    this.subscription.add(
      this.pageService.deletePage(pageId).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(response.data);
          this.userService.setTargetPage(response.data.pages[0]);
          this.disableForm = false;
          this.disableDeletePageButton = false;
          this.openPageOptionsModal = false;
        },
        error: (event) => {
          this.disableForm = false;
          this.disableDeletePageButton = false;
        },
      })
    );
  }

  onChangePasswordFormSubmit() {
    this.disableForm = true;
    this.disableChangePasswordForm = true;

    const requestBody: any = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.subscription.add(
      this.userService.changePassword(requestBody).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(response.data);
          this.disableForm = false;
          this.disableChangePasswordForm = false;
          this.openChangePasswordModal = false;
          this.changePasswordForm.reset();
          if (this.changePasswordForm_submitFeedbackMessage) {
            this.changePasswordForm_submitFeedbackMessage = undefined;
          }
        },
        error: (event) => {
          this.changePasswordForm_submitFeedbackMessage = event.error.message;
          this.disableForm = false;
          this.disableChangePasswordForm = false;
        },
      })
    );
  }

  sendDeleteAccountVerificationCode() {
    this.disableForm = true;
    this.resendCodeCooldown = true;
    this.resendCodeCooldownRemainingTime = 20;

    this.subscription.add(
      this.userService.sendDeleteAccountVerificationCode().subscribe({
        next: (response: any) => {
          this.disableForm = false;
          this.openDeleteAccountWarningModal = false;
          this.openDeleteAccountVerificationModal = true;

          const countdown = setInterval(() => {
            this.resendCodeCooldownRemainingTime--;
            if (this.resendCodeCooldownRemainingTime <= 0) {
              clearInterval(countdown);
              this.resendCodeCooldown = false;
            }
          }, 1000);
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  deleteAccount() {
    this.disableForm = true;
    this.disableDeleteAccountForm = true;

    const verificationCode = Object.values(
      this.deleteAccountVerificationForm.value
    ).join('');

    const requestBody: any = {
      verificationCode: verificationCode,
    };

    this.subscription.add(
      this.userService.deleteAccount(requestBody).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(undefined);
          this.router.navigate(['/']);
        },
        error: (event) => {
          this.deleteAccountVerificationForm_submitFeedbackMessage =
            event.error.message;
          this.deleteAccountVerificationForm.reset();
          this.disableForm = false;
          this.disableDeleteAccountForm = false;
        },
      })
    );
  }

  sendAccountVerificationCode() {
    this.disableForm = true;
    this.resendCodeCooldown = true;
    this.resendCodeCooldownRemainingTime = 20;

    this.subscription.add(
      this.userService.sendAccountVerificationCode().subscribe({
        next: (response: any) => {
          this.disableForm = false;
          this.openAccountVerificationModal = true;

          const countdown = setInterval(() => {
            this.resendCodeCooldownRemainingTime--;
            if (this.resendCodeCooldownRemainingTime <= 0) {
              clearInterval(countdown);
              this.resendCodeCooldown = false;
            }
          }, 1000);
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  verifyAccount() {
    this.disableForm = true;
    this.disableVerifyAccountForm = true;

    const verificationCode = Object.values(
      this.accountVerificationForm.value
    ).join('');

    const requestBody: any = {
      verificationCode: verificationCode,
    };

    this.subscription.add(
      this.userService.verifyAccount(requestBody).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(response.data);
          this.disableForm = false;
          this.disableVerifyAccountForm = false;
          this.openAccountVerificationModal = false;
        },
        error: (event) => {
          this.accountVerificationForm_submitFeedbackMessage =
            event.error.message;
          this.accountVerificationForm.reset();
          this.disableForm = false;
          this.disableVerifyAccountForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
