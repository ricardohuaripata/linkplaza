import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
  showPassword: boolean = false;
  signUpForm: FormGroup;
  feedbackMessage?: string;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), this.passwordValidator],
      ],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email = control.value;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !pattern.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.value;
    // verifica al menos una letra minúscula, una letra mayúscula, un número y un carácter especial
    if (
      password &&
      (!/(?=.*[a-z])/.test(password) ||
        !/(?=.*[A-Z])/.test(password) ||
        !/(?=.*\d)/.test(password) ||
        !/(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง?\\|[\]\/~`"'])/.test(password))
    ) {
      return { invalidPassword: true };
    }
    return null;
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
          this.router.navigate(['/admin']);
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
