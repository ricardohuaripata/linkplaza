import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';
import {
  emailValidator,
  passwordValidator,
} from '../../validators/user-validators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
  showPassword: boolean = false;
  signUpForm: FormGroup;
  feedbackMessage?: string;
  disableForm: boolean = false;
  urlParam?: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), passwordValidator],
      ],
    });

    this.route.queryParams.subscribe((params) => {
      this.urlParam = params['url'];
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
    };

    this.subscription.add(
      this.authService.signUp(requestBody).subscribe({
        next: (response: any) => {
          this.router.navigate(['/new-page']);
          console.log(response);
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
