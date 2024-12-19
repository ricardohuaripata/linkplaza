import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../../../services/user/user.service';
import { passwordValidator } from '../../../../../../validators/user-validators';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnDestroy {
  @Output() closeModal = new EventEmitter<void>();

  changePasswordForm: FormGroup;
  changePasswordForm_submitFeedbackMessage?: string;
  disableForm: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), passwordValidator],
      ],
    });
  }

  onSumbit() {
    this.disableForm = true;

    const requestBody: any = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.subscription.add(
      this.userService.changePassword(requestBody).subscribe({
        next: (response: any) => {
          this.closeModal.emit();
        },
        error: (event) => {
          this.changePasswordForm_submitFeedbackMessage = event.error.message;
          this.disableForm = false;
        },
      })
    );
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
