import { Component } from '@angular/core';
import { FlickrService } from '../service/flickr.service';
import * as JSZip from 'jszip';
@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.css']
})
export class FlickrComponent {

  constructor(private flickrService: FlickrService) { }

  searchtext: string = '';  //search query
  photos: any[] = [];  //data store
  selectedPhotos: any[] = [];

  

  // search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

    // Function to add or remove an article from the selected list
    toggleSelectedArticle(photo: any) {
      const index = this.photos.findIndex(item => item === photo);
      if (index !== -1) {
        this.photos.splice(index, 1);
      }
    }
    isArticleSelected(article: any) {
      return this.selectedPhotos.includes(article);
    }

  //flickr search api
  search() {
    this.flickrService.searchPhotos(this.searchtext).subscribe(data => {
      this.photos = data.photos.photo;
      // console.log(this.photos);
      // console.log(data.photos);
    });
  }

  //flickr photo url api
  getPhotoUrl(photo: any): string {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  }

  //flickr photo source api
  getPhotoSource(photo: any): string {
    return `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
  }

  //flickr image download api
  downloadPhoto(photo: any) {
    const url = this.getPhotoUrl(photo);
    const title = photo.title.slice(0, 10); // Assuming 'title' is the property that contains the title of the image
    // Create an XMLHttpRequest to fetch the image
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'; // Set the response type to Blob
    xhr.onload = () => {
      const blob = xhr.response;
      const blobUrl = window.URL.createObjectURL(blob);
      // Create an <a> element and set the download attribute to the title
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${title}.jpg`; // Set the filename using the image title
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Release the object URL
      window.URL.revokeObjectURL(blobUrl);
    };
    xhr.open('GET', url);
    xhr.send();
  }

  //export all photos as zip file
  exportAllPhotos() {
    const zip = new JSZip();
    const currentDate = new Date().toISOString().replace(/[:.]/g, '-');
    const zipName = `${this.searchtext}_${currentDate}.zip`;
    this.photos.forEach((photo, index) => {
      const url = this.getPhotoUrl(photo);
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
          const photoName = `${this.searchtext}_photo_${index + 1}.jpg`;
          zip.file(photoName, data);
          if (index === this.photos.length - 1) {
            zip.generateAsync({ type: 'blob' })
              .then(content => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(content);
                a.download = zipName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              });
          }
        });
    });
  }
}

