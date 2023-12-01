import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewsapiService } from './service/newsapi.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
//imports all components
import { LiveseachComponent } from './news/livesearch/liveseach.component';
import { IncidetreportComponent } from './news/incidetreport/incidetreport.component';
import { YouTubeSearchComponent } from './youtube/youtube.component';
import { FlickrComponent } from './flickr/flickr.component';
import { IncidentReportDialogComponent } from './incident-report-dialog/incident-report-dialog.component';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import { YouTubeService } from './service/youtube.service';
import { FlickrService } from './service/flickr.service';
import { WikiService } from './service/wikipedia.service';
import { GoogleSearchComponent } from './google/google.component';
import { GoogleSearchService } from './service/google.service';
//all mat modules
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { TelegramComponent } from './telegram/telegram.component';
import { GlobalsearchComponent } from './globalsearch/globalsearch.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { FacebookComponent } from './facebook/facebook.component';
import { ElibraryComponent } from './elibrary/elibrary.component';
import { RegisterComponent } from './register/register.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    LiveseachComponent,
    IncidetreportComponent,
    YouTubeSearchComponent,
    FlickrComponent,
    IncidentReportDialogComponent,
    WikipediaComponent,
    GoogleSearchComponent,
    DashboardComponent,
    VideoModalComponent,
    TelegramComponent,
    GlobalsearchComponent,
    AdminComponent,
    LoginComponent,
    FacebookComponent,
    ElibraryComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OverlayModule,
    NgIf,
    FormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    NgSelectModule,
    FormsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgChartsModule,
  ],
  providers: [NewsapiService,YouTubeService,FlickrService,WikiService,GoogleSearchService],
  bootstrap: [AppComponent,IncidetreportComponent,LiveseachComponent,YouTubeSearchComponent,FlickrComponent,WikipediaComponent,GoogleSearchComponent, TelegramComponent]
})
export class AppModule { }
