import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  pseudo: string = '';
  genre: string = '';
  players: { pseudo: string; genre: string }[] = [];

  constructor(private router: Router) {
    // Charger les joueurs depuis le localStorage
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) this.players = JSON.parse(storedPlayers);
  }

  addPlayer() {
    if (this.pseudo && this.genre) {
      this.players.push({ pseudo: this.pseudo, genre: this.genre });
      this.pseudo = '';
      this.genre = '';
      localStorage.setItem('players', JSON.stringify(this.players));
    }
  }

  removePlayer(index: number) {
    this.players.splice(index, 1);
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  startGame() {
    this.router.navigate(['/mode']); // la page Mode sera créée ensuite
  }
}
