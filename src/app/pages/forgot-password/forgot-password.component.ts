import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

import { AuthService } from '../../services/auth/auth.service';
import { emailValidator } from '../../validators/user-validators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnDestroy {
  forgotPasswordForm: FormGroup;
  feedbackMessage?: string;
  successResponse?: boolean;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.maxLength(256), emailValidator],
      ],
    });
  }

  onSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      email: this.forgotPasswordForm.value.email,
    };

    this.subscription.add(
      this.authService.forgotPassword(requestBody).subscribe({
        next: (response: any) => {
          if (this.feedbackMessage) {
            this.feedbackMessage = undefined;
          }
          this.successResponse = true;
        },
        error: (event) => {
          this.feedbackMessage = event.error.message;
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
