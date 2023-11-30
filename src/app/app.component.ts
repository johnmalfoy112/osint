import { Component } from '@angular/core';
import { FullscreenService } from './service/fullscreen.service';
import { AuthService } from './service/auth.service';  // Import AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OSINT3.0';

  constructor(
    private fullscreenService: FullscreenService,
    private authService: AuthService,
    private router: Router  // Inject Router
  ) { }

  ngOnInit() {}

  toggleFullscreen() {
    const element = document.documentElement;
    this.fullscreenService.toggleFullscreen(element);
  }

  isFullscreen() {
    return this.fullscreenService.getFullscreenStatus();
  }

  // Add these methods
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    // Redirect to the login page after logout
    this.router.navigate(['/login']);
  }

  
  
}
