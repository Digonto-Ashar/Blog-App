// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private api: ApiService) {
    this.loadInitialUser();
  }

  // Check localStorage when the app starts to see if a user session already exists
  private loadInitialUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  // Register a new user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/auth/register`, userData);
  }

  // Log in a user
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.api.baseUrl}/auth/login`, credentials, { 
      withCredentials: true 
    }).pipe(
      tap(response => {
        const user = response.user;
        user.token = response.token;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  // Log out a user
  logout(): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/auth/logout`, {}, { 
      withCredentials: true 
    }).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.userSubject.next(null);
      })
    );
  }

    getToken(): string | null {
    const currentUser = this.userSubject.getValue();
    if (currentUser && currentUser.token) {
      return currentUser.token;
    }
        const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      return parsedUser.token || null;
    }
    
    return null;
  }
}