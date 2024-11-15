import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private API_URL: string;
  private ENDPOINT: string;

  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
    this.ENDPOINT = '/api/v1/page';
  }

  getPageByUrl(url: string): Observable<any> {
    return this.http.get<any>(this.API_URL + this.ENDPOINT + '/' + url);
  }
  // authenticacion required
  createPage(requestBody: any): Observable<any> {
    return this.http.post<any>(this.API_URL + this.ENDPOINT, requestBody);
  }
  // authenticacion required
  updatePage(id: number, requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/' + id,
      requestBody
    );
  }
  // authenticacion required
  addSocialLink(id: number, requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/' + id + '/social-link',
      requestBody
    );
  }
  // authenticacion required
  addCustomLink(id: number, requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/' + id + '/custom-link',
      requestBody
    );
  }
}
