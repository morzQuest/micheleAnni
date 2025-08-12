import { Injectable } from '@angular/core';

interface Particle{ x:number; y:number; vx:number; vy:number; life:number; size:number; hue:number; }

@Injectable({providedIn:'root'})
export class ConfettiService{
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D | null;
  private raf = 0;
  private bgParticles: Particle[] = []; // langsame Hintergrundpartikel

  private ensure(){
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0'; // hinter dem Inhalt
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    const onResize = ()=>{ this.canvas!.width = innerWidth; this.canvas!.height = innerHeight; };
    addEventListener('resize', onResize); onResize();
  }

  /** Leise animierter Hintergrund (dezent): */
  startAnimatedConfetti(options: {opacity?: number, count?: number, speed?: number} = {}){
    const { opacity = 0.12, count = 220, speed = 0.25 } = options;
    this.ensure();
    const canvas = this.canvas; const ctx = this.ctx;
    if (!canvas || !ctx) return;

    const w = canvas.width, h = canvas.height;
    this.bgParticles = Array.from({length: count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*speed,
      vy: (Math.random()-0.5)*speed,
      size: Math.random()*3+2,
      life: 1,
      hue: Math.random()*360
    }));

    const draw = () => {
      // Rebind bei Resize
      const c = this.canvas; const x = this.ctx; if (!c || !x) return;
      const ww = c.width, hh = c.height;
      x.clearRect(0,0,ww,hh);
      for(const p of this.bgParticles){
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = ww; if (p.x > ww) p.x = 0;
        if (p.y < 0) p.y = hh; if (p.y > hh) p.y = 0;
        x.globalAlpha = opacity;
        x.fillStyle = `hsl(${p.hue} 70% 60%)`;
        x.fillRect(p.x, p.y, p.size, p.size*2);
      }
      this.raf = requestAnimationFrame(draw);
    };
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(draw);
  }

  /** Explosions‑Konfetti (Burst) wie zuvor */
  burst(n = 250){
    this.ensure();
    const canvas = this.canvas; const ctx = this.ctx; if (!canvas || !ctx) return;
    const particles: Particle[] = [];

    for (let i=0; i<n; i++){
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: canvas.width/2,
        y: canvas.height/2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        hue: Math.random() * 360,
        life: 1
      });
    }

    const step = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0,0,canvas.width, canvas.height);
      for (let i=particles.length - 1; i>=0; i--){
        const p = particles[i];
        p.vy += 0.12;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        ctx.globalAlpha = Math.max(p.life,0);
        ctx.fillStyle = `hsl(${p.hue} 80% 60%)`;
        ctx.fillRect(p.x, p.y, p.size, p.size*2);
        if (p.life <= 0) particles.splice(i,1);
      }
      if (particles.length > 0) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
