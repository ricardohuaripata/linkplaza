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
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
  showPassword: boolean = false;
  signUpForm: FormGroup;
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
    const body: any = {
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
    };

    this.subscription.add(
      this.authService.register(body).subscribe({
        next: (response: any) => {
          this.router.navigate(['/auth/signup']);
        },
        error: (event) => {
          alert('Oops! Something went wrong...');
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
