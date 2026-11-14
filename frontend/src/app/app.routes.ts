import { Routes } from '@angular/router';
import { TravelPageComponent } from './features/travel/components/travel-page/travel-page.component';
import { SavedStoriesPageComponent } from './features/saved-stories/components/saved-stories-page/saved-stories-page.component';

export const routes: Routes = [
  { path: '', component: TravelPageComponent, title: 'TransitTales - podróż' },
  { path: 'saved', component: SavedStoriesPageComponent, title: 'Zapisane opowieści - TransitTales' },
  { path: '**', redirectTo: '' }
];