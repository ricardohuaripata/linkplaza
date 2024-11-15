import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL: string;
  private ENDPOINT: string;

  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
    this.ENDPOINT = '/api/v1/auth';
  }

  signIn(requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/signin',
      requestBody,
      { withCredentials: true }
    );
  }

  signUp(requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/signup',
      requestBody,
      { withCredentials: true }
    );
  }
}
