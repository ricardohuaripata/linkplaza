import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';
import { AnalyticService } from '../../../../services/analytic/analytic.service';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { RouterLink } from '@angular/router';
import { CustomLink } from '../../../../interfaces/custom-link';

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
  totalClicks: number = 0;
  totalUniqueClicks: number = 0;
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
            .getPageVisitsByDateRange(
              this.targetPage.id,
              this.formatDate(startDate),
              this.formatDate(today)
            )
            .subscribe({
              next: (response: any) => {
                this.totalViews = response.totalViews;
                this.totalUniqueViews = response.totalUniqueViews;
                this.totalClicks = response.totalClicks;
                this.totalUniqueClicks = response.totalUniqueClicks;
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
                const clicks = response.timeseries.map(
                  (entry: any) => entry.clicks
                );
                const uniqueClicks = response.timeseries.map(
                  (entry: any) => entry.uniqueClicks
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
                      data: clicks,
                      type: 'spline',
                      name: 'Clicks',
                    },
                    {
                      data: uniqueClicks,
                      type: 'spline',
                      name: 'Unique clicks',
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
          .getPageVisitsByDateRange(
            this.targetPage.id,
            this.formatDate(startDate),
            this.formatDate(today)
          )
          .subscribe({
            next: (response: any) => {
              this.totalViews = response.totalViews;
              this.totalUniqueViews = response.totalUniqueViews;
              this.totalClicks = response.totalClicks;
              this.totalUniqueClicks = response.totalUniqueClicks;
              this.customLinkAnalytics = response.customLinkAnalytics;

              const dates = response.timeseries.map((entry: any) => entry.date);
              const views = response.timeseries.map(
                (entry: any) => entry.views
              );
              const uniqueViews = response.timeseries.map(
                (entry: any) => entry.uniqueViews
              );
              const clicks = response.timeseries.map(
                (entry: any) => entry.clicks
              );
              const uniqueClicks = response.timeseries.map(
                (entry: any) => entry.uniqueClicks
              );

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
                    data: clicks,
                    type: 'spline',
                    name: 'Clicks',
                  },
                  {
                    data: uniqueClicks,
                    type: 'spline',
                    name: 'Unique clicks',
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
