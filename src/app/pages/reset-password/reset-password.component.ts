import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { passwordValidator } from '../../validators/user-validators';
import { LoadingComponent } from "../../shared/loading/loading.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoadingComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnDestroy {
  resetPasswordForm: FormGroup;
  feedbackMessage?: string;
  disableForm: boolean = false;
  showPassword: boolean = false;
  token: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(256),
          passwordValidator,
        ],
      ],
    });

    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      token: this.token,
      password: this.resetPasswordForm.value.password,
    };

    this.subscription.add(
      this.authService.resetPassword(requestBody).subscribe({
        next: (response: any) => {
          this.router.navigate(['/signin']);
        },
        error: (event) => {
          this.feedbackMessage = 'Invalid request.';
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
