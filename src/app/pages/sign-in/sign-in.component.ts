import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnDestroy {
  showPassword: boolean = false;
  signInForm: FormGroup;
  feedbackMessage?: string;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password,
    };

    this.subscription.add(
      this.authService.signIn(requestBody).subscribe({
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
