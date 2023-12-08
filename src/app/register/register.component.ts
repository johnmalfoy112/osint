import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  showPassword = false;
  showConfirmPassword = false;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.initializeForm();
  }

  //get user details
  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get role(){
    return this.registerForm.get('role');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  //submit button function
  submitDetails() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;
    // Extract the selected role from the dropdown
    console.log('Selected Role:', this.registerForm.get('role')?.value);
    postData.role = this.registerForm.get('role')?.value;
    console.log('Post Data:', postData);
    this.authService.registerUser(postData).subscribe(
      () => {
        this.router.navigate(['login']);
      },
      (error) => {
        // Handle registration error
      }
    );
  }
  

  private initializeForm() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['']
    }, {
      validators: passwordMatchValidator
    });
  }

}
