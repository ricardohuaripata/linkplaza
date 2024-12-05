import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { User } from '../../../../interfaces/user';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { PageService } from '../../../../services/page/page.service';
import {
  characterPatternValidator,
  noDotAtEdgesValidator,
} from '../../../../validators/url-validators';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
})
export class AdminAccountComponent implements OnInit, OnDestroy {
  loggedUser?: User;
  targetPage?: Page;

  openPageOptionsModal?: boolean;
  openDeleteAccountWarningModal?: boolean;
  openDeleteAccountVerificationModal?: boolean;
  openAccountVerificationModal?: boolean;

  selectedPage?: Page;
  changePageUrlForm: FormGroup;
  changePageUrlForm_submitFeedbackMessage?: string;

  deleteAccountVerificationForm: FormGroup;
  deleteAccountVerificationForm_submitFeedbackMessage?: string;

  accountVerificationForm: FormGroup;
  accountVerificationForm_submitFeedbackMessage?: string;

  disableForm: boolean = false;
  resendCodeCooldown: boolean = false;
  resendCodeCooldownRemainingTime: number = 20;

  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private pageService: PageService,
    private fb: FormBuilder,
    private router: Router
  ) {
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
        error: (event) => {
          this.disableForm = false;
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
          this.openAccountVerificationModal = false;
        },
        error: (event) => {
          this.accountVerificationForm_submitFeedbackMessage =
            event.error.message;
          this.accountVerificationForm.reset();
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
