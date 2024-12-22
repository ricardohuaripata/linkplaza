import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

import { AnalyticService } from '../../../../services/analytic/analytic.service';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { CustomLink } from '../../../../interfaces/custom-link';
import { SocialLink } from '../../../../interfaces/social-link';

interface SocialLinkAnalytic {
  socialLink: SocialLink;
  clicks: number;
  uniqueClicks: number;
}

interface CustomLinkAnalytic {
  customLink: CustomLink;
  clicks: number;
  uniqueClicks: number;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [HighchartsChartModule, RouterLink],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss',
})
export class AdminAnalyticsComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  disableForm: boolean = true;

  targetPage?: Page;
  totalViews: number = 0;
  totalUniqueViews: number = 0;
  totalSocialLinkClicks: number = 0;
  totalSocialLinkUniqueClicks: number = 0;
  totalCustomLinkClicks: number = 0;
  totalCustomLinkUniqueClicks: number = 0;
  socialLinkAnalytics: SocialLinkAnalytic[] = [];
  customLinkAnalytics: CustomLinkAnalytic[] = [];

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions?: Highcharts.Options;

  constructor(
    private analyticService: AnalyticService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        this.targetPage = page;
      })
    );

    if (isPlatformBrowser(this.platformId)) {
      if (this.targetPage) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);

        this.subscription.add(
          this.analyticService
            .getPageAnalyticsByDateRange(
              this.targetPage.id,
              this.formatDate(startDate),
              this.formatDate(today)
            )
            .subscribe({
              next: (response: any) => {
                this.totalViews = response.totalViews;
                this.totalUniqueViews = response.totalUniqueViews;
                this.totalSocialLinkClicks = response.totalSocialLinkClicks;
                this.totalSocialLinkUniqueClicks =
                  response.totalSocialLinkUniqueClicks;
                this.totalCustomLinkClicks = response.totalCustomLinkClicks;
                this.totalCustomLinkUniqueClicks =
                  response.totalCustomLinkUniqueClicks;
                this.socialLinkAnalytics = response.socialLinkAnalytics;
                this.customLinkAnalytics = response.customLinkAnalytics;

                const dates = response.timeseries.map(
                  (entry: any) => entry.date
                );
                const views = response.timeseries.map(
                  (entry: any) => entry.views
                );
                const uniqueViews = response.timeseries.map(
                  (entry: any) => entry.uniqueViews
                );
                const socialLinkClicks = response.timeseries.map(
                  (entry: any) => entry.socialLinkClicks
                );
                const socialLinkUniqueClicks = response.timeseries.map(
                  (entry: any) => entry.socialLinkUniqueClicks
                );
                const customLinkClicks = response.timeseries.map(
                  (entry: any) => entry.customLinkClicks
                );
                const customLinkUniqueClicks = response.timeseries.map(
                  (entry: any) => entry.customLinkUniqueClicks
                );

                // actualizar grafico con los datos obtenidos
                this.chartOptions = {
                  title: {
                    text: undefined,
                  },
                  xAxis: {
                    categories: dates,
                    title: {
                      text: undefined,
                    },
                  },
                  yAxis: {
                    title: {
                      text: undefined,
                    },
                  },
                  tooltip: {
                    shared: true,
                  },
                  series: [
                    {
                      data: views,
                      type: 'spline',
                      name: 'Views',
                    },
                    {
                      data: uniqueViews,
                      type: 'spline',
                      name: 'Unique views',
                    },
                    {
                      data: socialLinkClicks,
                      type: 'spline',
                      name: 'Social link clicks',
                    },
                    {
                      data: socialLinkUniqueClicks,
                      type: 'spline',
                      name: 'Unique social link clicks',
                    },
                    {
                      data: customLinkClicks,
                      type: 'spline',
                      name: 'Custom link clicks',
                    },
                    {
                      data: customLinkUniqueClicks,
                      type: 'spline',
                      name: 'Unique custom link clicks',
                    },
                  ],
                };

                this.disableForm = false;
              },
              error: (event) => {},
            })
        );
      }
    }
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  selectDateRange(event: Event) {
    this.disableForm = true;

    const value = (event.target as HTMLSelectElement).value;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - parseInt(value));

    if (this.targetPage) {
      this.subscription.add(
        this.analyticService
          .getPageAnalyticsByDateRange(
            this.targetPage.id,
            this.formatDate(startDate),
            this.formatDate(today)
          )
          .subscribe({
            next: (response: any) => {
              this.totalViews = response.totalViews;
              this.totalUniqueViews = response.totalUniqueViews;
              this.totalSocialLinkClicks = response.totalSocialLinkClicks;
              this.totalSocialLinkUniqueClicks =
                response.totalSocialLinkUniqueClicks;
              this.totalCustomLinkClicks = response.totalCustomLinkClicks;
              this.totalCustomLinkUniqueClicks =
                response.totalCustomLinkUniqueClicks;
              this.socialLinkAnalytics = response.socialLinkAnalytics;
              this.customLinkAnalytics = response.customLinkAnalytics;

              const dates = response.timeseries.map((entry: any) => entry.date);
              const views = response.timeseries.map(
                (entry: any) => entry.views
              );
              const uniqueViews = response.timeseries.map(
                (entry: any) => entry.uniqueViews
              );
              const socialLinkClicks = response.timeseries.map(
                (entry: any) => entry.socialLinkClicks
              );
              const socialLinkUniqueClicks = response.timeseries.map(
                (entry: any) => entry.socialLinkUniqueClicks
              );
              const customLinkClicks = response.timeseries.map(
                (entry: any) => entry.customLinkClicks
              );
              const customLinkUniqueClicks = response.timeseries.map(
                (entry: any) => entry.customLinkUniqueClicks
              );

              // actualizar grafico con los datos obtenidos
              this.chartOptions = {
                title: {
                  text: undefined,
                },
                xAxis: {
                  categories: dates,
                  title: {
                    text: undefined,
                  },
                },
                yAxis: {
                  title: {
                    text: undefined,
                  },
                },
                tooltip: {
                  shared: true,
                },
                series: [
                  {
                    data: views,
                    type: 'spline',
                    name: 'Views',
                  },
                  {
                    data: uniqueViews,
                    type: 'spline',
                    name: 'Unique views',
                  },
                  {
                    data: socialLinkClicks,
                    type: 'spline',
                    name: 'Social link clicks',
                  },
                  {
                    data: socialLinkUniqueClicks,
                    type: 'spline',
                    name: 'Unique social link clicks',
                  },
                  {
                    data: customLinkClicks,
                    type: 'spline',
                    name: 'Custom link clicks',
                  },
                  {
                    data: customLinkUniqueClicks,
                    type: 'spline',
                    name: 'Unique custom link clicks',
                  },
                ],
              };

              this.disableForm = false;
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
