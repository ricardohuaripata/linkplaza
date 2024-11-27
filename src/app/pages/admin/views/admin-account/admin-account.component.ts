import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../../../interfaces/user';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
})
export class AdminAccountComponent {
  loggedUser?: User;
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.loggedUser$.subscribe((user) => {
        console.log(user);
        this.loggedUser = user;
      })
    );
  }

  switchPage(page: Page) {
    this.userService.setTargetPage(page);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
