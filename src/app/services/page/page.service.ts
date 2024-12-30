import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  getSocialPlatforms(): Observable<any> {
    return this.http.get<any>(this.API_URL + '/api/v1/social-platform');
  }

  // authenticacion required
  createPage(requestBody: any): Observable<any> {
    return this.http.post<any>(this.API_URL + this.ENDPOINT, requestBody, {
      withCredentials: true,
    });
  }
  // authenticacion required
  updatePage(id: number, requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/' + id,
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  uploadPicture(id: number, picture: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('picture', picture);

    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/' + id + '/picture',
      formData,
      { withCredentials: true }
    );
  }
  // authenticacion required
  deletePage(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + this.ENDPOINT + '/' + id, {
      withCredentials: true,
    });
  }
  // authenticacion required
  addSocialLink(pageId: number, requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/' + pageId + '/social-link',
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  addCustomLink(pageId: number, requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/' + pageId + '/custom-link',
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  updateSocialLink(id: number, requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/social-link/' + id,
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  updateCustomLink(id: number, requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/custom-link/' + id,
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  sortSocialLinks(pageId: number, requestBody: any): Observable<any> {
    return this.http.put<any>(
      this.API_URL + this.ENDPOINT + '/' + pageId + '/social-link/sort',
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  sortCustomLinks(pageId: number, requestBody: any): Observable<any> {
    return this.http.put<any>(
      this.API_URL + this.ENDPOINT + '/' + pageId + '/custom-link/sort',
      requestBody,
      { withCredentials: true }
    );
  }
  // authenticacion required
  deleteSocialLink(id: number): Observable<any> {
    return this.http.delete<any>(
      this.API_URL + this.ENDPOINT + '/social-link/' + id,
      { withCredentials: true }
    );
  }
  // authenticacion required
  deleteCustomLink(id: number): Observable<any> {
    return this.http.delete<any>(
      this.API_URL + this.ENDPOINT + '/custom-link/' + id,
      { withCredentials: true }
    );
  }
}
