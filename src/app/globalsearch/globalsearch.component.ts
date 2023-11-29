import { Component } from '@angular/core';
import { GlobalsearchService } from '../service/globalsearch.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoModalComponent } from '../video-modal/video-modal.component';
@Component({
  selector: 'app-globalsearch',
  templateUrl: './globalsearch.component.html',
  styleUrls: ['./globalsearch.component.css']
})
export class GlobalsearchComponent {

   // search placeholder functions
   isFocused: boolean = false;
   onFocus() {
     this.isFocused = true;
   }
   onBlur() {
     this.isFocused = false;
   }

   searchQuery: string;
   searchResults: any[];
   isModalOpen = false;
   nextPageToken: string = '';

   constructor(private globalService: GlobalsearchService,  public dialog: MatDialog) {}

   search() {
    this.globalService.search(this.searchQuery, this.nextPageToken);
    this.globalService.searchResults$.subscribe(results => {
      if (this.nextPageToken) {
        // Append new results to the existing searchResults
        this.searchResults[0].items.push(...results[0]?.items);
      } else {
        this.searchResults = results;
      }
      this.nextPageToken = results[0]?.nextPageToken;
    });
  }
  loadMore() {
    this.globalService.search(this.searchQuery, this.nextPageToken);
  }
  //open youtube dialog box
  openDialog(video: any): void {
    const videoLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    this.isModalOpen = true;
    const dialogRef = this.dialog.open(VideoModalComponent, {
      width: '1200px', height: '500px',
      data: {
        videoLink: videoLink,
        channel: {
          profilePictureUrl: video.snippet.thumbnails.default.url,
          name: video.snippet.channelTitle,
          postedDate: video.snippet.publishedAt,
        },
        title: video.snippet.title,
        description: video.fullDescription,
      },

    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.isModalOpen = false;
    });
  }

   getThumbnailUrl(thumbnails: any): string {
    // Choose a higher quality thumbnail size
    return thumbnails.high.url;
  }

}
