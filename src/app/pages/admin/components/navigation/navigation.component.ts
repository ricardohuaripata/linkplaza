import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Page } from '../../../../interfaces/page';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit, OnDestroy {
  targetPage?: Page;
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        this.targetPage = page;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
