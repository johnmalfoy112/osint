import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { NewsapiService } from './newsapi.service';
import { YouTubeService } from './youtube.service';
import { catchError } from 'rxjs/operators';

interface SearchResult {
  youtubeResults: any[]; // Replace 'any' with the actual type of the video item
  newsResults: any[]; // Adjust the type based on the actual response
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
export class GlobalsearchService {

  constructor(
    private http: HttpClient,
    private newsService: NewsapiService,
    private youtubeService: YouTubeService
  ) { }

  nextPageToken: string = '';


  private _searchResultsSubject = new BehaviorSubject<any[]>([]);
  searchResults$ = this._searchResultsSubject.asObservable();

  search(query: string, nextPageToken?: string) {
    const youtubeResults = this.youtubeService.searchVideos(query, 10, nextPageToken);
    const newsResults = this.newsService.topheadlines(query);

    forkJoin([youtubeResults, newsResults])
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return [];
        })
      )
      .subscribe(
        (results: any[]) => {
          const flattenedResults = results.reduce((acc, curr) => acc.concat(curr), []);
          this._searchResultsSubject.next(flattenedResults);
        }
      );
  }


  getVideoDetails(videoId: string): Observable<VideoDetails> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyAewc2uUhSTPQJh0gCZ08huARw0WAlZx64`;
    // console.log(url);
    return this.http.get<VideoDetails>(url);
  }


}
