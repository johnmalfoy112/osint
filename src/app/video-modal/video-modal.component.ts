import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare var YT: any; // Declare the YouTube variable

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.css']
})
export class VideoModalComponent {
  private player: any; // Variable to hold the YouTube player

  videoLink: string;
  channel: any;
  isModalOpen = false;


  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<VideoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.videoLink = data.videoLink;
    this.channel = data.channel;
    // console.log(data);
  }

  ngOnInit(): void {
    this.initYouTubePlayer();
  }

  initYouTubePlayer() {
    this.player = new YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId: this.getVideoIdFromLink(this.videoLink), // Extract the video ID from the link
      events: {
        'onReady': this.onPlayerReady.bind(this), // Bind this context
      }
    });
  }

  onPlayerReady(event : any) {
    // You can perform actions when the player is ready here
    event.target.playVideo(); // For example, play the video
  }

  getVideoIdFromLink(link: string): string {
    // Implement a function to extract the video ID from the link
    // Example: https://www.youtube.com/watch?v=VIDEO_ID
    const matches = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return (matches && matches[1]) || '';
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.isModalOpen = false;
  }



}
