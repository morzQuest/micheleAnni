import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfettiService } from './confetti.service';

interface Bubble { src:string; r:number; x:number; y:number; vx:number; vy:number; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy{
  private confetti = inject(ConfettiService);
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;
  @ViewChild('centerBox') centerRef!: ElementRef<HTMLDivElement>;

  images = ['assets/images/img1.jpg','assets/images/img2.jpg','assets/images/img3.jpg','assets/images/img4.jpg','assets/images/img5.jpg','assets/images/img6.jpg'];
  bubbles: Bubble[] = [];

  private raf = 0; private lastTs = 0;
  private bounds = { w: 0, h: 0 };
  private centerRect = { x: 0, y: 0, w: 0, h: 0 };

// src/app/home.component.ts
  ngOnInit(){
    this.confetti.startAnimatedConfetti({ opacity: 0.12, count: 220, speed: 0.25 });
    // einmaliger „Boom“ beim Einstieg:
    this.confetti.burst(240);
  }

  ngAfterViewInit(){ this.measure(); this.initBubbles(); this.raf = requestAnimationFrame(this.step); }
  ngOnDestroy(){ cancelAnimationFrame(this.raf); }

  @HostListener('window:resize') onResize(){ this.measure(); }

  private measure(){
    const host = this.hostRef.nativeElement.getBoundingClientRect();
    this.bounds = { w: host.width, h: Math.max(host.height, window.innerHeight*0.8) };
    if (this.centerRef){
      const r = this.centerRef.nativeElement.getBoundingClientRect();
      const hostR = this.hostRef.nativeElement.getBoundingClientRect();
      this.centerRect = { x: r.left-hostR.left, y: r.top-hostR.top, w: r.width, h: r.height };
    }
  }

  private initBubbles(){
    const sizes = [220, 180, 140];
    const rand = (a:number,b:number)=> a + Math.random()*(b-a);
    const N = this.images.length;
    this.bubbles = Array.from({length:N}, (_,i)=>{
      const d = sizes[i % sizes.length];
      const r = d/2;
      let x = rand(r, this.bounds.w - r), y = rand(r, this.bounds.h - r);
      // nicht in der Centerbox starten
      if (this.intersectsCenter(x,y,r)) { x = r + 10; y = r + 10; }
      const speed = rand(28, 60), ang = rand(0, Math.PI*2);
      return { src: this.images[i], r, x, y, vx: Math.cos(ang)*speed, vy: Math.sin(ang)*speed };
    });
  }

  private step = (ts:number) => {
    const dt = this.lastTs ? Math.min((ts - this.lastTs)/1000, 0.05) : 0; this.lastTs = ts;
    if (dt>0){
      for (const b of this.bubbles){
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x - b.r < 0){ b.x = b.r; b.vx = Math.abs(b.vx); }
        if (b.x + b.r > this.bounds.w){ b.x = this.bounds.w - b.r; b.vx = -Math.abs(b.vx); }
        if (b.y - b.r < 0){ b.y = b.r; b.vy = Math.abs(b.vy); }
        if (b.y + b.r > this.bounds.h){ b.y = this.bounds.h - b.r; b.vy = -Math.abs(b.vy); }
        if (this.intersectsCenter(b.x,b.y,b.r)){
          // einfache Reflektion an Center‑Textbox
          const cx = Math.max(this.centerRect.x, Math.min(b.x, this.centerRect.x + this.centerRect.w));
          const cy = Math.max(this.centerRect.y, Math.min(b.y, this.centerRect.y + this.centerRect.h));
          const dx = b.x - cx, dy = b.y - cy;
          if (Math.abs(dx) > Math.abs(dy)) { b.vx *= -1; b.x += Math.sign(dx) * 4; }
          else { b.vy *= -1; b.y += Math.sign(dy) * 4; }
        }
      }
    }
    this.raf = requestAnimationFrame(this.step);
  }

  private intersectsCenter(x:number,y:number,r:number){
    const cr = this.centerRect;
    const cx = Math.max(cr.x, Math.min(x, cr.x + cr.w));
    const cy = Math.max(cr.y, Math.min(y, cr.y + cr.h));
    return Math.hypot(x-cx, y-cy) < r + 6;
  }
}
