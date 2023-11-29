import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  private isFullscreen: boolean = false;

  constructor() { }

  toggleFullscreen(element: any): void {
    if (!this.isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen(); // Cast to 'any' to bypass TypeScript error
      } else if (element.mozRequestFullScreen) {
        (element as any).mozRequestFullScreen(); // Cast to 'any' to bypass TypeScript error
      } else if (element.msRequestFullscreen) {
        (element as any).msRequestFullscreen(); // Cast to 'any' to bypass TypeScript error
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen(); // Cast to 'any' to bypass TypeScript error
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen(); // Cast to 'any' to bypass TypeScript error
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen(); // Cast to 'any' to bypass TypeScript error
      }
      this.isFullscreen = false;
    }
  }

  getFullscreenStatus(): boolean {
    return this.isFullscreen;
  }
}
