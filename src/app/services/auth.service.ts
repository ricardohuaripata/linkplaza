import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  signIn(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + this.ENDPOINT + '/signin', body, {
      observe: 'response',
    });
  }

  register(body: any): Observable<any> {
    return this.http.post<any>(this.API_URL + this.ENDPOINT + '/signup', body, {
      observe: 'response',
    });
  }
}
