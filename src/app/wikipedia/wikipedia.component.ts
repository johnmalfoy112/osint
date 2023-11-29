import { Component } from '@angular/core';
import { WikiService } from '../service/wikipedia.service';

@Component({
  selector: 'app-wikipedia',
  templateUrl: './wikipedia.component.html',
  styleUrls: ['./wikipedia.component.css']
})
export class WikipediaComponent {

  searchTerm: any;
  results: any = [];
  totalResults: any;
  page: number = 1;

  constructor(private wiki: WikiService) {}

   //placeholder functions
   isFocused: boolean = false;
   onFocus() {
     this.isFocused = true;
   }
   onBlur() {
     this.isFocused = false;
   }

  //wikipedia api results
  onSubmit() {
    this.wiki.search(this.searchTerm).subscribe((res: any) => {
      this.results = res.query.search;
      this.totalResults = res.query.search.length;
      console.log(this.results);
    });
  }

}
