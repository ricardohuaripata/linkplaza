import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

import { Page } from '../../../../interfaces/page';
import { UserService } from '../../../../services/user/user.service';
import { LoadingComponent } from "../../../../shared/loading/loading.component";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoadingComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit, OnDestroy {
  targetPage?: Page;
  disableForm: boolean = false;
  openSignOutModal?: boolean;

  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        this.targetPage = page;
      })
    );
  }

  signOut() {
    this.disableForm = true;

    this.subscription.add(
      this.userService.signOut().subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(undefined);
          this.router.navigate(['/']);
        },
        error: (event) => {},
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
