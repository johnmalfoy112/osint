import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://192.168.130.176:3000/api/users';

  constructor(private http: HttpClient) { this.setupWindowEventListener(); }

  registerUser(userDetails: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, userDetails);
  }

  loginUser(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('islogin') === 'true';
  }

  logout(): void {
    localStorage.removeItem('islogin');
  }

  getLoggedInUser(): User | null {
    const userJson = localStorage.getItem('loggedInUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  private setupWindowEventListener(): void {
    window.addEventListener('beforeunload', (event) => {
      this.logout();
    });
    window.addEventListener('unload', (event) => {
      this.logout();
    });
  }
}
