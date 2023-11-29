import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface YouTubeApiResponse {
  items: any[]; // Replace 'any' with the actual type of the video item
  nextPageToken: String;
}
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
@Injectable({
  providedIn: 'root'
})
export class YouTubeService {

  constructor(private http: HttpClient) { }

  //Youtube Api URL's & Keys
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search'; //Youtube api URL
  private apiKey = 'AIzaSyAjZpFHkkE_6-UqAB4n73jv7LH5m36p0VI';   //Youtube api key keys : "AIzaSyAjZpFHkkE_6-UqAB4n73jv7LH5m36p0VI","AIzaSyATM5ZIbLsMDHWj9-dmbVqBC-k6cNy6TgI","AIzaSyAewc2uUhSTPQJh0gCZ08huARw0WAlZx64"
  private youtubeUrl = 'http://localhost:3000/api/youtube';     //mongo db api url don't change it

  //Youtube api
  searchVideos(keyword: string, maxResults: number,  pageToken?: string): Observable<YouTubeApiResponse> {
    let url = `${this.apiUrl}?key=${this.apiKey}&part=snippet&type=video&q=${keyword}&maxResults=${maxResults}`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    return this.http.get<YouTubeApiResponse>(url);
  }

  //loadmore api
  loadMore(nextPageToken: string, keyword: string, maxResults: number): Observable<YouTubeApiResponse> {
    return this.searchVideos(keyword, maxResults, nextPageToken);
  }

  //Youtube video details
  getVideoDetails(videoId: string): Observable<VideoDetails> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.apiKey}`;
    // console.log(url);
    return this.http.get<VideoDetails>(url);
  }

  //youtube channel search
  searchChannels(keyword: string, maxResults: number): Observable<YouTubeApiResponse> {
    const url = `${this.apiUrl}?key=${this.apiKey}&part=snippet&type=channel&q=${keyword}&maxResults=${maxResults}`;
    return this.http.get<YouTubeApiResponse>(url);
  }

  //youtube channel videos search from channel search
  getChannelVideos(channelId: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&channelId=${channelId}&type=video&part=snippet&maxResults=50`;
    // console.log(url);
    return this.http.get(url);
  }

  // mongodb api
  saveToMongoDB(items: any): Observable<any> {
    // console.log('Data to Save in MongoDB:', items);
    return this.http.post(this.youtubeUrl, items);
  }

}
