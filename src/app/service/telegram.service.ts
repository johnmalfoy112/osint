import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  private apiUrl = 'https://api.telegram.org/';
  // Inject HttpClient in your component/service
  constructor(private http: HttpClient) { }

  // Function to get updates
  getUpdates(): Observable<any> {
    const botToken = '6934710719:AAEqo8DfKGqxcnILUwgP7A0D4I2E9R_IwRg';
    const apiUrl = `${this.apiUrl}bot${botToken}/getUpdates`;
    console.log(apiUrl);

    return this.http.get(apiUrl);
  }



}


