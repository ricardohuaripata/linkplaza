import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

import { environment } from '../../../environments/environment.development';
import { SeoConfig } from '../../interfaces/seo-config';
import { SeoService } from '../../services/seo.service';

import { PageService } from '../../services/page/page.service';
import { Page } from '../../interfaces/page';
import { NotFoundComponent } from '../not-found/not-found.component';

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
    private seo: SeoService
  ) {
    this.route.params.subscribe((params) => {
      this.pageUrl = params['url'];

      if (this.pageUrl) {
        this.subscription.add(
          this.pageService.getPageByUrl(this.pageUrl).subscribe({
            next: (response: any) => {
              this.page = response.data;

              if (this.page) {
                const seoConfig: SeoConfig = {
                  page_title: this.page.title
                    ? this.page.title + ' | LinkPlaza'
                    : this.page.url + ' | LinkPlaza',
                  page_description: this.page.bio
                    ? this.page.bio
                    : 'Hey visit now my page and check my bio!',
                  page_url: environment.BASE_URL,
                  page_image_url:
                    environment.BASE_URL + '/img/LinkPlaza-Preview.jpg',
                };

                this.seo.setPageTitle(seoConfig.page_title);
                this.seo.setCanonicalURL(seoConfig.page_url);
                this.seo.setIndexFollow(true);
                this.seo.setSocialMetaTags(seoConfig);
              }

              console.log(response);
            },
            error: (event) => {
              this.seo.setPageTitle('Not found | LinkPlaza');
            },
          })
        );
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
