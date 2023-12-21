import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveseachComponent } from './news/livesearch/liveseach.component';
import { IncidetreportComponent } from './news/incidetreport/incidetreport.component';
import { YouTubeSearchComponent } from './youtube/youtube.component';
import { FlickrComponent } from './flickr/flickr.component';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import { GoogleSearchComponent } from './google/google.component';
import { TelegramComponent } from './telegram/telegram.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlobalsearchComponent } from './globalsearch/globalsearch.component';
import { LoginComponent } from './login/login.component';
import { FacebookComponent } from './facebook/facebook.component';
import { ElibraryComponent } from './elibrary/elibrary.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guard/auth.guard';
import { ImageSearchComponent } from './image-search/image-search.component';
import { GoogleTrendsSearchComponent } from './google-trends-search/google-trends-search.component';

const routes: Routes = [
   //Routes for components
   
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'livesearch', component: LiveseachComponent,canActivate: [authGuard] },
  { path: 'incidentreport', component: IncidetreportComponent,canActivate: [authGuard] },
  { path: 'youtube', component: YouTubeSearchComponent,canActivate: [authGuard] },
  { path: 'flickr', component: FlickrComponent,canActivate: [authGuard] },
  { path: 'wikipedia', component: WikipediaComponent,canActivate: [authGuard] },
  { path: 'google', component: GoogleSearchComponent,canActivate: [authGuard] },
  { path: 'youtube', component: YouTubeSearchComponent,canActivate: [authGuard]},
  { path: 'flickr', component: FlickrComponent,canActivate: [authGuard]},
  { path: 'wikipedia', component: WikipediaComponent,canActivate: [authGuard]},
  { path: 'google', component: GoogleSearchComponent,canActivate: [authGuard]},
  { path: 'telegram', component: TelegramComponent, canActivate:[authGuard] },
  { path: 'dashboard', component: DashboardComponent ,canActivate: [authGuard] },
  { path: 'globalsearch', component: GlobalsearchComponent, canActivate:[authGuard] },
  { path: 'facebook', component: FacebookComponent ,canActivate: [authGuard]},
  { path: 'elibrary', component: ElibraryComponent ,canActivate: [authGuard]},
  { path: 'image-search', component: ImageSearchComponent ,canActivate: [authGuard]},
  { path: 'googletrend', component: GoogleTrendsSearchComponent ,canActivate: [authGuard]},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ ],
})
export class AppRoutingModule { }
