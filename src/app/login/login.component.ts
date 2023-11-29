import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = ''; // Added property for error message
  showPassword = false; // Added property

  //login form group
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  //get id password
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  //show password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  //login button dunctionality
  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email as string, password as string).subscribe(
      response => {
        sessionStorage.setItem('email', email as string);
        localStorage.setItem("islogin", "true");
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Login failed:', error.error.message);
        localStorage.setItem("islogin", "false");
      }
    );
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
