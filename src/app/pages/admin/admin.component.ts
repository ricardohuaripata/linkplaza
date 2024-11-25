import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { User } from '../../interfaces/user';
import { Page } from '../../interfaces/page';
import { ReactiveFormsModule } from '@angular/forms';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { CustomLinksComponent } from './components/custom-links/custom-links.component';
import { Router } from '@angular/router';
import { CustomizationComponent } from './components/customization/customization.component';
import { InfoComponent } from './components/info/info.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SocialLinksComponent,
    CustomLinksComponent,
    CustomizationComponent,
    InfoComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  authUser?: User;
  targetPage?: Page;
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
            this.authUser = response.data;
            this.targetPage = response.data.pages[0];

            if (!this.targetPage) {
              this.router.navigate(['/new-page']);
            }
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
