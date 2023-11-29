import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GoogleSearchService {

  private apiUrl = 'https://www.googleapis.com/customsearch/v1'; // Google Custom Search API URL
  private apiKey = ' AIzaSyDjbFzrZBigFSGg2Ws0VmIPQEl9WayaEBs '; // Replace with your actual API key AIzaSyCXd99w44BQ2bpU9gDiwpJIaWBlck6gw60,  AIzaSyDjbFzrZBigFSGg2Ws0VmIPQEl9WayaEBs
  private cx = 'b3f4675e4167c43e4'; // Replace with your actual custom search engine ID , b3f4675e4167c43e4, e43899fb2f7c44d4d

  constructor(private http: HttpClient) {}

//search query api
search(query: string, startIndex: number, maxResults: number): Observable<any> {
  const params = new HttpParams()
    .set('q', query)
    .set('key', this.apiKey)
    .set('cx', this.cx)
    .set('start', startIndex.toString())  // Add start parameter for pagination
    .set('num', maxResults.toString());  // Add num parameter for max results per page
  return this.http.get(this.apiUrl, { params });
}

//search image api
searchImages(query: string, startIndex: number): Observable<any> {
  const params = new HttpParams()
    .set('q', query)
    .set('key', this.apiKey)
    .set('cx', this.cx)
    .set('searchType', 'image') // Add the searchType parameter for image search
    .set('start', startIndex.toString()); // Add the 'start' parameter for pagination
  return this.http.get(this.apiUrl, { params });
}


}
