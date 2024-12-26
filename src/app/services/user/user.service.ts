import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { Page } from '../../interfaces/page';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL: string;
  private ENDPOINT: string;
  private loggedUserSource = new BehaviorSubject<User | undefined>(undefined);
  private targetPageSource = new BehaviorSubject<Page | undefined>(undefined);
  loggedUser$ = this.loggedUserSource.asObservable();
  targetPage$ = this.targetPageSource.asObservable();

  constructor(private http: HttpClient) {
    this.API_URL = environment.API_URL;
    this.ENDPOINT = '/api/v1/user';
  }

  setLoggedUser(user: User | undefined): void {
    this.loggedUserSource.next(user);
  }

  setTargetPage(page: Page | undefined): void {
    this.targetPageSource.next(page);
  }

  // authenticacion required
  getUserInfo(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.ENDPOINT + '/account/info', {
      withCredentials: true,
    });
  }
  // authenticacion required
  signOut(): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/account/signout',
      {},
      {
        withCredentials: true,
      }
    );
  }
  // authenticacion required
  sendDeleteAccountVerificationCode(): Observable<any> {
    return this.http.post<any>(
      this.API_URL +
        this.ENDPOINT +
        '/account/send-delete-account-verification-code',
      {},
      {
        withCredentials: true,
      }
    );
  }
  // authenticacion required
  deleteAccount(requestBody: any): Observable<any> {
    return this.http.delete<any>(this.API_URL + this.ENDPOINT + '/account', {
      withCredentials: true,
      body: requestBody,
    });
  }
  // authenticacion required
  sendAccountVerificationCode(): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/account/send-account-verification-code',
      {},
      {
        withCredentials: true,
      }
    );
  }
  // authenticacion required
  verifyAccount(requestBody: any): Observable<any> {
    return this.http.post<any>(
      this.API_URL + this.ENDPOINT + '/account/verify',
      requestBody,
      {
        withCredentials: true,
      }
    );
  }
  // authenticacion required
  changePassword(requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/account/password',
      requestBody,
      {
        withCredentials: true,
      }
    );
  }
  // authenticacion required
  changeEmail(requestBody: any): Observable<any> {
    return this.http.patch<any>(
      this.API_URL + this.ENDPOINT + '/account/email',
      requestBody,
      {
        withCredentials: true,
      }
    );
  }
}
