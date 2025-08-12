// src/app/memory.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfettiService } from './confetti.service';

const MEMORY_ITEMS: { img:string; desc:string }[] = [
  { img: 'assets/memory/Affare.jpg',    desc: 'assets/memory/Affare_desc.jpg' },
  { img: 'assets/memory/Baby.jpg',      desc: 'assets/memory/Baby_desc.jpg' },
  { img: 'assets/memory/Botox.jpg', desc: 'assets/memory/Botox_desc.jpg' },
  { img: 'assets/memory/Lahmacun.jpg',      desc: 'assets/memory/Lahmacun_desc.jpg' },
  { img: 'assets/memory/Mucke.jpg',      desc: 'assets/memory/Mucke_desc.jpg' },
  { img: 'assets/memory/Pizza.jpg',      desc: 'assets/memory/Pizza_desc.jpg' },
  { img: 'assets/memory/Sleep.jpg',      desc: 'assets/memory/Sleep_desc.jpg' },
  { img: 'assets/memory/Sleepy.jpg',      desc: 'assets/memory/Sleepy_desc.jpg' },
];

type CardType = 'img' | 'desc';
interface Card { id:number; pairId:number; type:CardType; src:string; flipped:boolean; matched:boolean }

function shuffle<T>(a:T[]):T[]{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; }

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css'
})
export class MemoryComponent {
  private confetti = inject(ConfettiService);
  cards = signal<Card[]>([]);
  moves = signal(0);
  solved = signal(false);
  busy = signal(false);

  constructor(){ this.reset(); }

  private buildDeck(): Card[] {
    const deck: Card[] = [];
    MEMORY_ITEMS.forEach((item, idx) => {
      deck.push(
        { id: idx*2,     pairId: idx, type: 'img',  src: item.img,  flipped:false, matched:false },
        { id: idx*2 + 1, pairId: idx, type: 'desc', src: item.desc, flipped:false, matched:false }
      );
    });
    return shuffle(deck);
  }

  reset(){
    this.moves.set(0); this.solved.set(false); this.busy.set(false);
    this.cards.set(this.buildDeck());
  }

  clickCard(i:number){
    if (this.busy() || this.solved()) return;
    const arr = this.cards();
    const c = arr[i];
    if (!c || c.flipped || c.matched) return;

    c.flipped = true; this.cards.set([...arr]);
    const open = arr.filter(x => x.flipped && !x.matched);

    if (open.length === 2){
      this.busy.set(true); this.moves.set(this.moves()+1);
      setTimeout(() => {
        const [a,b] = open;
        if (a.pairId === b.pairId && a.id !== b.id) { a.matched = b.matched = true; }
        else { a.flipped = b.flipped = false; }
        this.cards.set([...arr]); this.busy.set(false);

        if (this.cards().every(x => x.matched)) {
          this.solved.set(true);
          try{ this.confetti.burst(260); }catch{}
        }
      }, 650);
    }
  }
}
