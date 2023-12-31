import { Component } from '@angular/core';
import { FullscreenService } from './service/fullscreen.service';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { ChangeDetectorRef } from '@angular/core';
=======
>>>>>>> bee0162627080bbaf599607b02f49d907ddc229f

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'OSINT3.0';
  isAdmin: boolean = false;
  username: string = '';
  welcomeMessage: string = '';

  constructor(
    private fullscreenService: FullscreenService,
    private authService: AuthService,
<<<<<<< HEAD
    private router: Router,
    private cdr: ChangeDetectorRef // Add this line
  ) {  }

  ngOnInit() {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      // Fetch role from local storage
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        this.welcomeMessage = `Welcome ${storedRole} ${loggedInUser.email}`;
        console.log('Welcome Message:', this.welcomeMessage);
      }
    
      this.cdr.detectChanges(); // Add this line
    }
  }
=======
    private router: Router
  ) {  }

  ngOnInit() {}
>>>>>>> bee0162627080bbaf599607b02f49d907ddc229f

  
  toggleFullscreen() {
    const element = document.documentElement;
    this.fullscreenService.toggleFullscreen(element);
  }

  isFullscreen() {
    return this.fullscreenService.getFullscreenStatus();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    // Redirect to the login page after logout
    this.router.navigate(['/login']);
  }
}
