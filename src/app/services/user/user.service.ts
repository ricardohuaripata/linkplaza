import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL: string;
  private ENDPOINT: string;

  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
    this.ENDPOINT = '/api/v1/user';
  }

  // authenticacion required
  getUserInfo(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.ENDPOINT + '/account/info', {
      withCredentials: true,
    });
  }
}
