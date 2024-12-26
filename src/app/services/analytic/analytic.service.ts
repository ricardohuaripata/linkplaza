import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  private API_URL: string;
  private ENDPOINT: string;
  private API_KEY: string;

  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
    this.ENDPOINT = '/api/v1/analytic';
    this.API_KEY = environment.API_KEY;
  }

  getPageAnalyticsByDateRange(
    pageId: number,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const params = { pageId, startDate, endDate };
    return this.http.get<any>(this.API_URL + this.ENDPOINT, {
      params,
      withCredentials: true,
    });
  }

  logVisit(pageId: number): Observable<any> {
    const params = { pageId };
    const headers = { Authorization: this.API_KEY };
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/visit',
      {},
      {
        params,
        headers,
      }
    );
  }
  logSocialLinkClick(socialLinkId: number): Observable<any> {
    const params = { socialLinkId };
    const headers = { Authorization: this.API_KEY };
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/social-link-click',
      {},
      {
        params,
        headers,
      }
    );
  }
  logCustomLinkClick(customLinkId: number): Observable<any> {
    const params = { customLinkId };
    const headers = { Authorization: this.API_KEY };
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/custom-link-click',
      {},
      {
        params,
        headers,
      }
    );
  }
}
