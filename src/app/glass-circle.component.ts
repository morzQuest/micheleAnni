import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-circle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circle" [style.--size.px]="size">
      <img *ngIf="src" [src]="src" alt="" loading="lazy"/>
      <!-- Optionales, UNVERSCHWÄCHTES Overlay (ohne Blur) -->
      <div class="glass" *ngIf="showOverlay"></div>
      <div class="shine" *ngIf="showShine"></div>
      <span class="cap" *ngIf="caption">{{caption}}</span>
    </div>
  `,
  styles: [`
    :host{ display:block }
    .circle{
      position:relative; width:var(--size,140px); height:var(--size,140px);
      border-radius:50%; overflow:hidden;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 18px 60px rgba(0,0,0,.4);
    }
    /* Bild scharf, kein Blur */
    .circle img{
      width:100%; height:100%; object-fit:cover; display:block;
      filter:none; border-radius:50%;
    }
    /* Overlay OHNE backdrop-filter (kein Blur mehr) */
    .glass{
      position:absolute; inset:0;
      /* leichtes Glasgefühl ohne Unschärfe */
      background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.04));
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
      pointer-events:none;
    }
    .shine{
      position:absolute; left:-20%; top:-30%; width:140%; height:60%;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.65), rgba(255,255,255,0) 60%);
      transform: rotate(-15deg);
      pointer-events:none;
    }
    .cap{
      position:absolute; left:50%; bottom:8px; transform:translateX(-50%);
      padding:3px 8px; border-radius:10px; font-size:12px; color:#e5e7eb;
      background: rgba(15,23,42,.55); border:1px solid rgba(255,255,255,.12)
    }
  `]
})
export class GlassCircleComponent{
  @Input() src = '';
  @Input() caption?: string;
  /** Kreisgröße in px */
  @Input() size = 110;      // kleinerer Default
  /** Optionales Overlay/Glanz ein-/ausblenden */
  @Input() showOverlay = true;
  @Input() showShine = true;
}
