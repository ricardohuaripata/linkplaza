import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';
import { LoadingComponent } from "../../shared/loading/loading.component";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
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
        },
        error: (event) => {
          this.feedbackMessage = event.error.message;
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
