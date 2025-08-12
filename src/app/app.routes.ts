import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MemoryComponent } from './memory.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'gallery', component: MemoryComponent, title: 'Memory' },
  { path: '**', redirectTo: '' }
];
