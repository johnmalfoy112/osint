import { Component } from '@angular/core';
import { YouTubeService } from '../service/youtube.service';
import * as Sentiment from 'sentiment';
import { MatDialog } from '@angular/material/dialog';
import { VideoModalComponent } from '../video-modal/video-modal.component';
interface VideoDetails {
  kind: string;
  etag: string;
  items: Array<{
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      channelTitle: string;
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
      tags: string[]; // Added tags property
    };
  }>;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}
@Component({
  selector: 'app-youtube-search',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YouTubeSearchComponent {

  constructor(private youtubeService: YouTubeService, public dialog: MatDialog) { }

  searchQuery: string;  //search text
  videos: any[];  //data store
  channels: any[];
  maxResults = 50; // Number of videos to display
  selectedSentimentFilter: string = 'all';
  sentiment: Sentiment = new Sentiment();
  sentimentFilterActive: boolean = false;
  searchType: 'video' | 'channel' = 'video';
  clickedChannel: any;
  clickedChannel1: any;
  clickedChannelVideos: any[];
  clickedChannelVideos1: any[];
  isModalOpen = false;
  selectedVideoId: string;
  details: { [key: string]: any } = {};
  nextpagetoken: String | undefined;

  //back button
  goBack() {
    this.clickedChannel = null;
    this.clickedChannel1 = null;
  }

  // check selected sentiment
  selectSentimentFilter(filter: string) {
    this.selectedSentimentFilter = filter;
    this.searchVideos();
  }

  // sentiment filter
  filterResults() {
    this.sentimentFilterActive = this.selectedSentimentFilter !== 'all';
    const allVideos = this.videos;
    this.videos = allVideos.filter(video => {
      const titleSentiment = this.sentiment.analyze(video.snippet.title);
      const sentimentScore = titleSentiment.score;
      let isMatch = true;
      switch (this.selectedSentimentFilter) {
        case 'positive':
          isMatch = sentimentScore > 0;
          break;
        case 'negative':
          isMatch = sentimentScore < 0;
          break;
        case 'neutral':
          isMatch = sentimentScore === 0;
          break;
      }
      return isMatch;
    });
  }

  //show keyword in console
  getValue(val: string) {
    // console.warn(val)
  }

  //placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  //reset display
  resetResults() {
    this.videos = []; // Assuming you have a property 'videos'
    this.channels = []; // Assuming you have a property 'channels'
    this.clickedChannelVideos1 = [];
    this.clickedChannelVideos = [];
  }

  //reset search placeholder
  setSearchType(type: "video" | "channel") {
    this.searchType = type;
    this.searchQuery = ''; // Reset searchQuery
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


  //search videos api
  searchVideos() {
    if (this.searchType === 'video') {
      this.youtubeService.searchVideos(this.searchQuery, this.maxResults).subscribe((data) => {
        this.videos = data.items;
        // console.log(this.videos);
        // console.log(data);
        this.nextpagetoken = data.nextPageToken;
        // console.log(this.nextpagetoken);
        // console.log(this.searchQuery);
        // Apply sentiment filter
        if (this.selectedSentimentFilter !== 'all') {
          this.videos = this.videos.filter(video => {
            const titleSentiment = this.sentiment.analyze(video.snippet.title);
            const sentimentScore = titleSentiment.score;
            switch (this.selectedSentimentFilter) {
              case 'positive':
                return sentimentScore > 0;
              case 'negative':
                return sentimentScore < 0;
              case 'neutral':
                return sentimentScore === 0;
              default:
                return false; // Make sure to have a default case
            }
          });
        }
        // console.log(this.videos);
        // console.log('Search Query:', this.searchQuery);
        //youtube video full description
        this.videos.forEach(video => {
          const videoId = video.id.videoId;
          // console.log(videoId);
          if (videoId) {
            this.youtubeService.getVideoDetails(videoId).subscribe(
              (details: VideoDetails) => {
                if (details && details.items && details.items[0] && details.items[0].snippet && details.items[0].snippet.description) {
                  video.fullDescription = details.items[0].snippet.description;
                  video.tags = details.items[0].snippet.tags;
                  // console.log(details);
                  // console.log(details.items[0].snippet.tags);
                  // console.log(typeof (details.items[0].snippet.tags));
                  let yt = {
                    "videoID": "https://www.youtube.com/watch?v=" + videoId,
                    "title": video.snippet.title,
                    "channelName": video.snippet.channelTitle,
                    "publishedDate": video.snippet.publishedAt,
                    "description": video.snippet.description,
                    "fullDescription": video.fullDescription, // Add the full description here
                    "searchQuery": this.searchQuery,
                    "tags": video.tags
                  };
                  this.youtubeService.saveToMongoDB(yt).subscribe({
                    next: response => {
                      // console.log('Data saved to MongoDB:', response);
                    },
                    error: error => {
                      // console.error('Error saving data to MongoDB:', error);
                    }
                  });
                }
              },
              (error) => {
                // console.error(`Error fetching video details for video ID ${videoId}:`, error);
              }
            );
          } else {
            // console.error(`Invalid video ID for video:`, video);
          }
        });
      });
    }
    //youtube channel search
    else if (this.searchType === 'channel') {
      this.youtubeService.searchChannels(this.searchQuery, this.maxResults).subscribe((data) => {
        this.channels = data.items;
        // console.log(this.searchQuery);
        // Additional logic for channels...
      });
    }
  }

// load more button
loadMore() {
  if (this.nextpagetoken) {
    this.youtubeService.loadMore(this.nextpagetoken.toString(), this.searchQuery, this.maxResults).subscribe(data => {
      const newVideos = data.items;

      newVideos.forEach(video => {
        const videoId = video.id.videoId;
        if (videoId) {
          this.youtubeService.getVideoDetails(videoId).subscribe(
            (details: VideoDetails) => {
              if (details && details.items && details.items[0] && details.items[0].snippet && details.items[0].snippet.description) {
                video.fullDescription = details.items[0].snippet.description;
                video.tags = details.items[0].snippet.tags;

                let yt = {
                  "videoID": "https://www.youtube.com/watch?v=" + videoId,
                  "title": video.snippet.title,
                  "channelName": video.snippet.channelTitle,
                  "publishedDate": video.snippet.publishedAt,
                  "description": video.snippet.description,
                  "fullDescription": video.fullDescription,
                  "searchQuery": this.searchQuery,
                  "tags": video.tags
                };

                this.youtubeService.saveToMongoDB(yt).subscribe({
                  next: response => {
                    // console.log('Data saved to MongoDB:', response);
                  },
                  error: error => {
                    // console.error('Error saving data to MongoDB:', error);
                  }
                });
              }
            },
            (error) => {
              // console.error(`Error fetching video details for video ID ${videoId}:`, error);
            }
          );
        } else {
          // console.error(`Invalid video ID for video:`, video);
        }
      });

      this.videos = [...this.videos, ...newVideos]; // Concatenate the new videos with the existing ones
      this.nextpagetoken = data.nextPageToken; // Save the new nextPageToken
    });
  }
}

  //youtube channel video from channel search
  showChannelVideos(channel: any) {
    const channelId = channel.id.channelId;
    // console.log('Clicked channelId:', channelId);
    this.youtubeService.getChannelVideos(channelId).subscribe((data) => {
      this.clickedChannelVideos = data.items;
      // console.log('Clicked channel videos:', this.clickedChannelVideos);
      this.clickedChannel = channel; // Assuming you want to keep track of the clicked channel
      // console.log('Clicked channel details:', this.clickedChannel);
      this.clickedChannel = this.channels.find(channel => channel.id.channelId === channelId);
      // console.log('Clicked channel:', this.clickedChannel);
      // Apply sentiment filter
      if (this.selectedSentimentFilter !== 'all') {
        this.videos = this.videos.filter(video => {
          const titleSentiment = this.sentiment.analyze(video.snippet.title);
          const sentimentScore = titleSentiment.score;
          switch (this.selectedSentimentFilter) {
            case 'positive':
              return sentimentScore > 0;
            case 'negative':
              return sentimentScore < 0;
            case 'neutral':
              return sentimentScore === 0;
            default:
              return false; // Make sure to have a default case
          }
        });
      }
      this.videos.forEach(video => {
        const videoId = video.id.videoId;
        if (videoId) {
          this.youtubeService.getVideoDetails(videoId).subscribe(
            (details: VideoDetails) => {
              if (details && details.items && details.items[0] && details.items[0].snippet && details.items[0].snippet.description) {
                video.fullDescription = details.items[0].snippet.description;
                video.tags = details.items[0].snippet.tags;
                // console.log(details);
                // console.log(details.items[0].snippet.tags);
                // console.log(typeof (details.items[0].snippet.tags));
                let yt = {
                  "videoID": "https://www.youtube.com/watch?v=" + videoId,
                  "title": video.snippet.title,
                  "channelName": video.snippet.channelTitle,
                  "publishedDate": video.snippet.publishedAt,
                  "description": video.snippet.description,
                  "fullDescription": video.fullDescription, // Add the full description here
                  "searchQuery": this.searchQuery,
                  "tags": video.tags
                };
                this.youtubeService.saveToMongoDB(yt).subscribe({
                  next: response => {
                    // console.log('Data saved to MongoDB:', response);
                  },
                  error: error => {
                    // console.error('Error saving data to MongoDB:', error);
                  }
                });
              }
            },
            (error) => {
              // console.error(`Error fetching video details for video ID ${videoId}:`, error);
            }
          );
        } else {
          // console.error(`Invalid video ID for video:`, video);
        }
      });
    });
  }

  //youtube channel video from video search
  showChannelVideosFromSearch(channel: any) {
    const channelId = channel.snippet.channelId;
    this.clickedChannel1 = true; // Set clickedChannel1 to true to show the channel section
    this.youtubeService.getChannelVideos(channelId).subscribe((data) => {
      // console.log(data);
      this.clickedChannelVideos1 = data.items;
      // console.log('Clicked channel videos:', this.clickedChannelVideos1);
      this.clickedChannel1 = channel; // Assuming you want to keep track of the clicked channel
      // Apply sentiment filter
      if (this.selectedSentimentFilter !== 'all') {
        this.videos = this.videos.filter(video => {
          const titleSentiment = this.sentiment.analyze(video.snippet.title);
          const sentimentScore = titleSentiment.score;
          switch (this.selectedSentimentFilter) {
            case 'positive':
              return sentimentScore > 0;
            case 'negative':
              return sentimentScore < 0;
            case 'neutral':
              return sentimentScore === 0;
            default:
              return false; // Make sure to have a default case
          }
        });
      }
      this.videos.forEach(video => {
        const videoId = video.id.videoId;
        // console.log(videoId);
        if (videoId) {
          this.youtubeService.getVideoDetails(videoId).subscribe(
            (details: VideoDetails) => {
              if (details && details.items && details.items[0] && details.items[0].snippet && details.items[0].snippet.description) {
                video.fullDescription = details.items[0].snippet.description;
                video.tags = details.items[0].snippet.tags;
                console.log(details);
                // console.log(video.fullDescription);
                // console.log(details.items[0].snippet.tags);
                // console.log(typeof (details.items[0].snippet.tags));
                let yt = {
                  "videoID": "https://www.youtube.com/watch?v=" + videoId,
                  "title": video.snippet.title,
                  "channelName": video.snippet.channelTitle,
                  "publishedDate": video.snippet.publishedAt,
                  "description": video.snippet.description,
                  "fullDescription": video.fullDescription, // Add the full description here
                  "searchQuery": this.searchQuery,
                  "tags": video.tags
                };
                this.youtubeService.saveToMongoDB(yt).subscribe({
                  next: response => {
                    // console.log('Data saved to MongoDB:', response);
                  },
                  error: error => {
                    // console.error('Error saving data to MongoDB:', error);
                  }
                });
              }
            },
            (error) => {
              // console.error(`Error fetching video details for video ID ${videoId}:`, error);
            }
          );
        } else {
          // console.error(`Invalid video ID for video:`, video);
        }
      });
    });
  }

  // Youtube Image Api
  getThumbnailUrl(thumbnails: any): string {
    // Choose a higher quality thumbnail size
    return thumbnails.high.url;
  }

}
