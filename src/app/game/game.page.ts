import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonButton, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class GamePage {
  players: { pseudo: string; genre: string }[] = [];
  gameMode: string = '';
  currentPlayerIndex: number = 0;
  consecutiveVerites: number = 0;
  gameStarted: boolean = false;
  
  // Cartes par mode et type
  gameCards = {
    classique: {
      actions: [
        "Fais 10 pompes",
        "Chante ta chanson préférée",
        "Imite un animal pendant 30 secondes",
        "Danse pendant 1 minute",
        "Raconte une blague"
      ],
      verites: [
        "Quel est ton plus grand secret ?",
        "Qui est ton crush actuel ?",
        "Quelle est ta plus grande peur ?",
        "Quel est ton rêve le plus fou ?",
        "Quelle est ta plus grosse bêtise ?"
      ]
    },
    soiree: {
      actions: [
        "Bois un verre d'un trait",
        "Fais le tour de la pièce en crabe",
        "Embrasse la personne à ta droite sur la joue",
        "Fais un battle de danse avec quelqu'un",
        "Raconte ton pire souvenir d'école"
      ],
      verites: [
        "Avec qui dans ce groupe sortirais-tu ?",
        "Quel est ton fantasme le plus inavouable ?",
        "As-tu déjà triché en couple ?",
        "Quelle est la chose la plus embarrassante que tu aies faite ?",
        "Combien de personnes as-tu embrassées ?"
      ]
    },
    extreme: {
      actions: [
        "Action extrême 1 (Mode Premium)",
        "Action extrême 2 (Mode Premium)"
      ],
      verites: [
        "Vérité extrême 1 (Mode Premium)",
        "Vérité extrême 2 (Mode Premium)"
      ]
    }
  };

  constructor(private router: Router) {
    // Récupérer les données depuis localStorage
    const storedPlayers = localStorage.getItem('players');
    const storedMode = localStorage.getItem('gameMode');
    
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
    }
    
    if (storedMode) {
      this.gameMode = storedMode;
    }
    
    // Vérifier qu'on a tout ce qu'il faut
    if (this.players.length < 2 || !this.gameMode) {
      this.router.navigate(['/home']);
    }
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get mustChooseAction() {
    return this.consecutiveVerites >= 3;
  }

  startGame() {
    this.gameStarted = true;
  }

  chooseAction() {
    const cards = this.gameCards[this.gameMode as keyof typeof this.gameCards];
    const randomAction = cards.actions[Math.floor(Math.random() * cards.actions.length)];
    
    // Reset compteur de vérités
    this.consecutiveVerites = 0;
    
    // Afficher la carte (pour l'instant, juste une alerte)
    alert(`Action pour ${this.currentPlayer.pseudo}: ${randomAction}`);
    
    this.nextPlayer();
  }

  chooseVerite() {
    if (this.mustChooseAction) {
      alert('Tu dois choisir une Action ! (3 vérités consécutives atteintes)');
      return;
    }

    const cards = this.gameCards[this.gameMode as keyof typeof this.gameCards];
    const randomVerite = cards.verites[Math.floor(Math.random() * cards.verites.length)];
    
    // Incrémenter compteur de vérités
    this.consecutiveVerites++;
    
    // Afficher la carte (pour l'instant, juste une alerte)
    alert(`Vérité pour ${this.currentPlayer.pseudo}: ${randomVerite}`);
    
    this.nextPlayer();
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  goBackToMode() {
    this.router.navigate(['/mode']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}