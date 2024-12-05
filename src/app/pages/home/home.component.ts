import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { UserService } from '../../services/user/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loggedUser?: User;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      url: [''],
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.loggedUser$.subscribe((user) => {
        if (user) {
          this.loggedUser = user;
        } else {
          if (isPlatformBrowser(this.platformId)) {
            this.subscription.add(
              this.userService.getUserInfo().subscribe({
                next: (response: any) => {
                  this.loggedUser = response.data;
                },
                error: (event) => {},
              })
            );
          }
        }
      })
    );
  }

  onSubmit() {
    const urlValue = this.form.value.url;
    if (urlValue && urlValue.trim() !== '') {
      this.router.navigate(['/signup'], { queryParams: { url: urlValue } });
    } else {
      this.router.navigate(['/signup']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
