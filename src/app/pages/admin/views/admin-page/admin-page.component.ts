import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { Page } from '../../../../interfaces/page';
import { UserService } from '../../../../services/user/user.service';

import { CustomLinksComponent } from './components/custom-links/custom-links.component';
import { CustomizationComponent } from './components/customization/customization.component';
import { InfoComponent } from './components/info/info.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    SocialLinksComponent,
    CustomLinksComponent,
    CustomizationComponent,
    InfoComponent,
    RouterLink
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit, OnDestroy {
  targetPage?: Page;
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        console.log(page);
        this.targetPage = page;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
