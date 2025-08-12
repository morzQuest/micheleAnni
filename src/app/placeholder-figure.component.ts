import { Component, Input, computed, signal } from '@angular/core';

function rnd(seed:number){
  // simple LCG for stable randomness per seed
  let s = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return ()=> (s = (1103515245 * s + 12345) >>> 0) / 2**32;
}

@Component({
  selector: 'app-placeholder-figure',
  standalone: true,
  template: `
  <svg [attr.viewBox]="'0 0 300 220'" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" [attr.stop-color]="c1()"/>
        <stop offset="100%" [attr.stop-color]="c2()"/>
      </linearGradient>
      <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"/></filter>
    </defs>
    <rect width="300" height="220" rx="18" fill="#0b1220" stroke="#ffffff22"/>
    <g filter="url(#goo)">
      <circle [attr.cx]="60" [attr.cy]="50" [attr.r]="30" fill="url(#g)"/>
      <circle [attr.cx]="240" [attr.cy]="60" [attr.r]="26" fill="url(#g)"/>
      <circle [attr.cx]="150" [attr.cy]="180" [attr.r]="40" fill="url(#g)"/>
    </g>
    <!-- stylized avatar -->
    <g [attr.transform]="'translate(150 115) scale(1.0)'">
      <circle cx="0" cy="0" r="46" [attr.fill]="skin()"/>
      <circle cx="-18" cy="-6" r="6" fill="#111827"/>
      <circle cx="18" cy="-6" r="6" fill="#111827"/>
      <rect x="-8" y="10" width="16" height="8" rx="4" fill="#1f2937"/>
      <path d="M-20,20 Q0,36 20,20" [attr.stroke]="hair()" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="-30" y="46" width="60" height="48" rx="12" [attr.fill]="shirt()"/>
    </g>
    <text x="12" y="210" fill="#93a1b3" font-size="12">#{{seed}}</text>
  </svg>
  `,
  styles: [':host{display:block}']
})
export class PlaceholderFigureComponent{
  @Input() seed = 1;
  private R = rnd(this.seed);
  private hue1 = signal(Math.floor(this.R()*360));
  private hue2 = signal((this.hue1()+60)%360);

  c1 = computed(()=> `hsl(${this.hue1()} 80% 60%)`);
  c2 = computed(()=> `hsl(${this.hue2()} 80% 60%)`);
  skin = computed(()=> `hsl(${(this.hue1()+30)%360} 60% 70%)`);
  hair = computed(()=> `hsl(${(this.hue1()+300)%360} 40% 20%)`);
  shirt = computed(()=> `hsl(${(this.hue2()+180)%360} 70% 45%)`);
}
