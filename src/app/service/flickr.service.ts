import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {

  constructor(private http: HttpClient) { }

  //Flickr Api URL's & Keys
  private apiUrl = 'https://api.flickr.com/services/rest/'; // Flickr Api URl
  private apiKey = '78482dee113f29cd0f010fa54f0e7b6e'; // Flickr API key


 // flickr api
   searchPhotos(query: string): Observable<any> {
    const params = {
      method: 'flickr.photos.search',
      api_key: this.apiKey,
      text: query,
      format: 'json',
      nojsoncallback: '1'
    };

    return this.http.get(this.apiUrl, { params });
  }

}
