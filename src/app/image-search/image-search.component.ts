// image-search.component.ts
import { Component } from '@angular/core';
import { ImageSearchService } from '../service/image-search.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent {

  constructor(private imageSearchService: ImageSearchService) {}

  imageUrl = ''; // Initialize with an empty string
  inlineImages: any[] = [];
  searchResults: any = {};

  // search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  searchByImage(): void {
    this.imageSearchService.searchByImage(this.imageUrl).subscribe(
      (response: any) => {
        this.searchResults = response;
        console.log(this.searchResults);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
