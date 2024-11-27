import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { User } from '../../interfaces/user';
import { UserService } from '../../services/user/user.service';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  loggedUser?: User;
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscription.add(
        this.userService.getUserInfo().subscribe({
          next: (response: any) => {
            console.log(response);
            this.loggedUser = response.data;
            this.userService.setLoggedUser(response.data);
            this.userService.setTargetPage(response.data.pages[0]);
          },
          error: (event) => {},
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
