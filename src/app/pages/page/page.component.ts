import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';

import { environment } from '../../../environments/environment';
import { SeoConfig } from '../../interfaces/seo-config';
import { SeoService } from '../../services/seo.service';

import { PageService } from '../../services/page/page.service';
import { Page } from '../../interfaces/page';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AnalyticService } from '../../services/analytic/analytic.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [NotFoundComponent, NgClass],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent implements OnInit, OnDestroy {
  pageUrl?: string;
  page?: Page;
  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute,
    private seo: SeoService,
    private analyticService: AnalyticService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.route.params.subscribe((params) => {
      this.pageUrl = params['url'];

      if (this.pageUrl) {
        this.subscription.add(
          this.pageService.getPageByUrl(this.pageUrl).subscribe({
            next: (response: any) => {
              this.page = response.data;
              // configurar SEO
              if (this.page) {
                const seoConfig: SeoConfig = {
                  page_title: this.page.title ? this.page.title + ' | LinkPlaza' : this.page.url + ' | LinkPlaza',
                  page_description: this.page.bio ? this.page.bio : 'Hey visit my page now and check my bio!',
                  page_url: environment.BASE_URL + '/page/' + this.pageUrl,
                  page_image_url: environment.BASE_URL + '/img/LinkPlaza-Preview.jpg',
                };

                this.seo.setPageTitle(seoConfig.page_title);
                this.seo.setPageDescription(seoConfig.page_description);
                this.seo.setCanonicalURL(seoConfig.page_url);
                this.seo.setIndexFollow(true);
                this.seo.setSocialMetaTags(seoConfig);
              }
            },
            error: (event) => {
              this.seo.setPageTitle('Not found | LinkPlaza');
            },
          })
        );
      }
    });
  }

  ngOnInit(): void {
    // registrar visita
    if (isPlatformBrowser(this.platformId)) {
      if (this.page) {
        this.subscription.add(
          this.analyticService.logVisit(this.page.id).subscribe()
        );
      }
    }
  }

  onClickSocialLink(socialLinkId: number) {
    this.subscription.add(
      this.analyticService.logSocialLinkClick(socialLinkId).subscribe()
    );
  }

  onClickCustomLink(customLinkId: number) {
    this.subscription.add(
      this.analyticService.logCustomLinkClick(customLinkId).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
