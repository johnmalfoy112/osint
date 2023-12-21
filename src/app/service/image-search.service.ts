import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private apiUrl = 'http://localhost:3001/search.json';

  // Add your SerpAPI key here
  private apiKey = 'd77f4eb2a8eb7e58f3a73c8e3ec36aeba6dca7151f4bff04a913a00868b15735';

  constructor(private http: HttpClient) {}

  searchByImage(imageUrl: string) {
    const params = new HttpParams({
      fromObject: {
        engine: 'google_reverse_image',
        image_url: imageUrl,
        api_key: this.apiKey, 
      },
    });

    return this.http.get(this.apiUrl, { params });
  }
}
