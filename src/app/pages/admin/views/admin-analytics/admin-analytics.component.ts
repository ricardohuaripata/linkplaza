import { Component } from '@angular/core';

import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss',
})
export class AdminAnalyticsComponent {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: {
      text: undefined,
    },
    xAxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        data: [50, 40, 60, 45, 70, 42, 60],
        type: 'spline',
        name: 'Views',
      },
      {
        data: [12, 16, 23, 9, 28, 18, 26],
        type: 'spline',
        name: 'Unique views',
      },
      {
        data: [6, 8, 11, 4, 13, 7, 12],
        type: 'spline',
        name: 'Clicks',
      },
      {
        data: [2, 1, 4, 2, 2, 3, 7],
        type: 'spline',
        name: 'Unique clicks',
      },
    ],
  };
}
