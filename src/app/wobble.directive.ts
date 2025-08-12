import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appWobble]', standalone: true })
export class WobbleDirective{
  constructor(private el: ElementRef<HTMLElement>){
    this.el.nativeElement.style.transition = 'transform .12s ease';
    this.el.nativeElement.style.willChange = 'transform';
  }
  @HostListener('pointermove', ['$event']) onMove(e:PointerEvent){
    const r = this.el.nativeElement.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / r.width, dy = (e.clientY - cy) / r.height;
    this.el.nativeElement.style.transform = `perspective(600px) rotateX(${dy*-8}deg) rotateY(${dx*8}deg) scale(1.02)`;
  }
  @HostListener('pointerleave') onLeave(){ this.el.nativeElement.style.transform = 'none'; }
}
