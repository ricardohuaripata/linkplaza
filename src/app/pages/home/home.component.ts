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
import { environment } from '../../../environments/environment';
import { SeoConfig } from '../../interfaces/seo-config';
import { SeoService } from '../../services/seo.service';

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
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const seoConfig: SeoConfig = {
      page_title: 'Everything you are, in one simple link | LinkPlaza',
      page_description: 'Join LinkPlaza and link to everything you create, share and sell online. All from the one bio link.',
      page_url: environment.BASE_URL,
      page_image_url: environment.BASE_URL + '/img/LinkPlaza-Preview.jpg',
    };

    this.seo.setPageTitle(seoConfig.page_title);
    this.seo.setCanonicalURL(seoConfig.page_url);
    this.seo.setIndexFollow(true);
    this.seo.setSocialMetaTags(seoConfig);

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
