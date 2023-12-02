import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-incident-report-dialog',
  templateUrl: './incident-report-dialog.component.html',
})
export class IncidentReportDialogComponent {

  newKeyword: string = '';
  newGroup: string = '';
  keywords: { keyword: string; group: string }[] = [];
  groups: string[] = [];
  selectedKeyword: string = '';
  selectedGroup: string = '';
  selectedKeywords: { keyword: string; group: string }[] = [];  // Modified to store selected keywords
  keywordList: { keyword: string; group: string }[] = [];

  constructor(public dialogRef: MatDialogRef<IncidentReportDialogComponent>) {}

  ngOnInit() {
    // Load keywords and groups from local storage on component initialization
    const storedKeywords = localStorage.getItem('keywords');
    if (storedKeywords) {
      this.keywords = JSON.parse(storedKeywords);
    }
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
    }
  }

  saveToLocalStorage() {
    // Save keywords and groups to local storage
    localStorage.setItem('keywords', JSON.stringify(this.keywords));
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  closeDialog(): void {
    // Save data to local storage before closing the dialog
    this.saveToLocalStorage();
    // Pass the selected keywords to the parent component before closing the dialog
    this.dialogRef.close(this.selectedKeywords);
  }
  addKeyword(): void {
    if (this.newKeyword.trim() !== '' && this.selectedGroup !== '') {
      this.keywords.push({ keyword: this.newKeyword, group: this.selectedGroup });
      this.newKeyword = '';
      this.selectedGroup = '';
      this.saveToLocalStorage(); // Save after adding a keyword
    }
  }

  addGroup(): void {
    if (this.newGroup.trim() !== '') {
      this.groups.push(this.newGroup);
      this.newGroup = '';
      this.saveToLocalStorage(); // Save after adding a group
    }
  }

  editKeyword(keywordObj: { keyword: string; group: string }): void {
    const index = this.keywords.findIndex(k => k.keyword === keywordObj.keyword && k.group === keywordObj.group);
    if (index !== -1) {
      this.newKeyword = keywordObj.keyword;
      this.selectedGroup = keywordObj.group;
      this.keywords.splice(index, 1);
    }
  }

  editGroup(group: string): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.newGroup = group;
      this.groups.splice(index, 1);
    }
  }

  deleteKeyword(keywordObj: { keyword: string; group: string }): void {
    const index = this.keywords.findIndex(k => k.keyword === keywordObj.keyword && k.group === keywordObj.group);
    if (index !== -1) {
      this.keywords.splice(index, 1);
    }
  }

  deleteGroup(group: string): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }

  selectKeyword(keyword: { keyword: string; group: string }): void {
    const index = this.selectedKeywords.findIndex(k => k.keyword === keyword.keyword);
    if (index !== -1) {
      this.selectedKeywords.splice(index, 1);
    } else {
      this.selectedKeywords.push(keyword);
    }
  }

}
