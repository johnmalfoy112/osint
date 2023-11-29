import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  //register user
  registerUser(userDetails: User): Observable<User> {
    console.log(userDetails);
    return this.http.post<User>(this.baseUrl, userDetails);
  }

  //login user
  loginUser(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

   // Check if the user is authenticated
  isAuthenticated(): boolean {
    const isLogin = localStorage.getItem('islogin');
    return isLogin === 'true';
  }

  // Log out the user
  logout(): void {
    localStorage.removeItem('islogin');
    // Additional logout logic if needed (e.g., redirect to login page)
  }


}
