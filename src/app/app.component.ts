import { Component } from '@angular/core';
import { FullscreenService } from './service/fullscreen.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'OSINT3.0';
  newsData: any[] = []; // Stores the retrieved news data

  constructor(private fullscreenService: FullscreenService) {
    localStorage.setItem("islogin", "false");
   }

  ngOnInit() {}

  toggleFullscreen() {
    const element = document.documentElement;
    this.fullscreenService.toggleFullscreen(element);
  }
  isFullscreen() {
    return this.fullscreenService.getFullscreenStatus();
  }

}
