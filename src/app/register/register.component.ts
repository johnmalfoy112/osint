import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from '../service/auth.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //registration form group
  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  //get user details
  get fullName() {
    return this.registerForm.controls['fullName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  //submit button function
  submitDetails() {
    const postData = { ...this.registerForm.value };
    console.log(postData);
    delete postData.confirmPassword;
    // Assuming userDetails is an object containing user details
    this.authService.registerUser(postData as User).subscribe(
      response => {
        // console.log(response);
        console.log('Register successfully');
        // Handle successful registration, e.g., navigate to login page
        this.router.navigate(['login']);
      },
      error => {
        console.error('Something went wrong');
        // Handle registration error
      }
    );

  }

}
