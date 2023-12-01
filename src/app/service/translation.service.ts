import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private apiUrl = 'YOUR_TRANSLATION_API_URL';
  private apiKey = 'YOUR_TRANSLATION_API_KEY';

  constructor(private http: HttpClient) {}

  translateText(text: string, targetLanguage: string): Observable<any> {
    const params = {
      q: text,
      target: targetLanguage,
      key: this.apiKey,
    };

    return this.http.post(`${this.apiUrl}/language/translate/v2`, null, { params });
  }
}
