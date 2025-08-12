import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderFigureComponent } from './placeholder-figure.component';
import { WobbleDirective } from './wobble.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, PlaceholderFigureComponent, WobbleDirective],
  templateUrl: './gallery.component.html'
})
export class GalleryComponent{
  items = Array.from({length: 12}, (_,i)=>({ seed: i+1 }));
}
