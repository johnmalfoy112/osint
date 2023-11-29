import { Component } from '@angular/core';
import { TelegramService } from '../service/telegram.service';

interface Update {
  messageId: number;
  text: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.css']
})
export class TelegramComponent {

  query: string;
  messages: any[] = [];

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }


  constructor(private telegramService: TelegramService) {}

getUpdates() {
  this.telegramService.getUpdates().subscribe(
    (response: any) => {
      if (response.ok) {
        this.messages = response.result.map((update: Update) => update.messageId);
        console.log(this.messages);
      } else {
        console.error('Error fetching updates:', response);
      }
    },
    error => {
      console.error('Error:', error);
    }
  );
}


}
