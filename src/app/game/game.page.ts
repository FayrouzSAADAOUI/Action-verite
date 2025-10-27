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

interface GameCard {
  id: string;
  mode: string;
  type: 'action' | 'verite';
  description: string;
  genreJoueur1: 'homme' | 'femme' | 'tous';
  genreJoueur2?: 'homme' | 'femme' | 'tous';
  timer?: number;
  repetable: boolean;
  photoObligatoire?: boolean;
}

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
  usedCards: { [playerId: string]: string[] } = {}; // Cartes déjà utilisées par joueur
  currentCard: GameCard | null = null;
  showCard: boolean = false;
  
  // Base de données des cartes
  allCards: GameCard[] = [
    // === MODE CLASSIQUE - ACTIONS ===
    {
      id: 'classic_action_1',
      mode: 'classique',
      type: 'action',
      description: 'Joueur 1 doit faire 10 pompes',
      genreJoueur1: 'tous',
      timer: 60,
      repetable: true,
      photoObligatoire: false
    },
    {
      id: 'classic_action_2',
      mode: 'classique',
      type: 'action',
      description: 'Joueur 1 doit chanter sa chanson préférée',
      genreJoueur1: 'tous',
      timer: 30,
      repetable: true,
      photoObligatoire: false
    },
    {
      id: 'classic_action_3',
      mode: 'classique',
      type: 'action',
      description: 'Joueur 1 doit imiter un animal pendant 30 secondes',
      genreJoueur1: 'tous',
      timer: 30,
      repetable: true,
      photoObligatoire: false
    },
    {
      id: 'classic_action_4',
      mode: 'classique',
      type: 'action',
      description: 'Joueur 1 doit faire une danse avec Joueur 2',
      genreJoueur1: 'tous',
      genreJoueur2: 'tous',
      timer: 60,
      repetable: true,
      photoObligatoire: true
    },
    {
      id: 'classic_action_5',
      mode: 'classique',
      type: 'action',
      description: 'Joueur 1 doit raconter une blague',
      genreJoueur1: 'tous',
      repetable: true,
      photoObligatoire: false
    },

    // === MODE CLASSIQUE - VÉRITÉS ===
    {
      id: 'classic_verite_1',
      mode: 'classique',
      type: 'verite',
      description: 'Joueur 1 doit révéler son plus grand secret',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'classic_verite_2',
      mode: 'classique',
      type: 'verite',
      description: 'Joueur 1 doit dire qui est son crush actuel',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'classic_verite_3',
      mode: 'classique',
      type: 'verite',
      description: 'Joueur 1 doit avouer sa plus grande peur',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'classic_verite_4',
      mode: 'classique',
      type: 'verite',
      description: 'Joueur 1 doit partager son rêve le plus fou',
      genreJoueur1: 'tous',
      repetable: true,
      photoObligatoire: false
    },
    {
      id: 'classic_verite_5',
      mode: 'classique',
      type: 'verite',
      description: 'Joueur 1 doit raconter sa plus grosse bêtise',
      genreJoueur1: 'tous',
      repetable: true,
      photoObligatoire: false
    },

    // === MODE SOIRÉE - ACTIONS ===
    {
      id: 'soiree_action_1',
      mode: 'soiree',
      type: 'action',
      description: 'Joueur 1 doit boire un verre d\'un trait',
      genreJoueur1: 'tous',
      repetable: true,
      photoObligatoire: true
    },
    {
      id: 'soiree_action_2',
      mode: 'soiree',
      type: 'action',
      description: 'Joueur 1 doit faire le tour de la pièce en crabe',
      genreJoueur1: 'tous',
      timer: 30,
      repetable: true,
      photoObligatoire: true
    },
    {
      id: 'soiree_action_3',
      mode: 'soiree',
      type: 'action',
      description: 'Joueur 1 doit embrasser Joueur 2 sur la joue',
      genreJoueur1: 'tous',
      genreJoueur2: 'tous',
      repetable: true,
      photoObligatoire: true
    },
    {
      id: 'soiree_action_4',
      mode: 'soiree',
      type: 'action',
      description: 'Joueur 1 doit faire un battle de danse avec Joueur 2',
      genreJoueur1: 'tous',
      genreJoueur2: 'tous',
      timer: 60,
      repetable: true,
      photoObligatoire: true
    },

    // === MODE SOIRÉE - VÉRITÉS ===
    {
      id: 'soiree_verite_1',
      mode: 'soiree',
      type: 'verite',
      description: 'Joueur 1 doit dire avec qui dans ce groupe il sortirait',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'soiree_verite_2',
      mode: 'soiree',
      type: 'verite',
      description: 'Joueur 1 doit révéler son fantasme le plus inavouable',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'soiree_verite_3',
      mode: 'soiree',
      type: 'verite',
      description: 'Joueur 1 doit avouer s\'il a déjà triché en couple',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },
    {
      id: 'soiree_verite_4',
      mode: 'soiree',
      type: 'verite',
      description: 'Joueur 1 doit dire combien de personnes il a embrassées',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    },

    // === MODE EXTRÊME - PREMIUM ===
    {
      id: 'extreme_action_1',
      mode: 'extreme',
      type: 'action',
      description: 'Action extrême premium - Débloquez pour voir !',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: true
    },
    {
      id: 'extreme_verite_1',
      mode: 'extreme',
      type: 'verite',
      description: 'Vérité extrême premium - Débloquez pour voir !',
      genreJoueur1: 'tous',
      repetable: false,
      photoObligatoire: false
    }
  ];

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

    // Initialiser les cartes utilisées pour chaque joueur
    this.players.forEach(player => {
      this.usedCards[player.pseudo] = [];
    });
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

  // Méthode pour filtrer les cartes disponibles
  getAvailableCards(type: 'action' | 'verite'): GameCard[] {
    const currentPlayer = this.currentPlayer;
    
    return this.allCards.filter(card => {
      // Filtre par mode
      if (card.mode !== this.gameMode) return false;
      
      // Filtre par type
      if (card.type !== type) return false;
      
      // Filtre par genre du joueur 1
      if (card.genreJoueur1 !== 'tous' && card.genreJoueur1 !== currentPlayer.genre) return false;
      
      // Filtre par répétabilité
      if (!card.repetable && this.usedCards[currentPlayer.pseudo]?.includes(card.id)) return false;
      
      return true;
    });
  }

  // Méthode pour sélectionner un joueur 2 selon le genre requis
  selectPlayer2(genreRequis?: 'homme' | 'femme' | 'tous'): { pseudo: string; genre: string } | null {
    if (!genreRequis || genreRequis === 'tous') {
      // Choisir un joueur aléatoire différent du joueur actuel
      const otherPlayers = this.players.filter((_, index) => index !== this.currentPlayerIndex);
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    }
    
    // Filtrer par genre requis, en excluant le joueur actuel
    const eligiblePlayers = this.players.filter((player, index) => 
      index !== this.currentPlayerIndex && player.genre === genreRequis
    );
    
    if (eligiblePlayers.length === 0) {
      // Si aucun joueur du genre requis, prendre n'importe qui d'autre
      const otherPlayers = this.players.filter((_, index) => index !== this.currentPlayerIndex);
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    }
    
    return eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
  }

  // Méthode pour remplacer les variables dynamiques dans la description
  processCardDescription(card: GameCard): string {
    let description = card.description;
    const player1 = this.currentPlayer;
    
    // Remplacer "Joueur 1"
    description = description.replace(/Joueur 1/g, player1.pseudo);
    
    // Remplacer "Joueur 2" si nécessaire
    if (card.genreJoueur2) {
      const player2 = this.selectPlayer2(card.genreJoueur2);
      if (player2) {
        description = description.replace(/Joueur 2/g, player2.pseudo);
      }
    }
    
    return description;
  }

  // Tirer une carte selon les critères
  drawCard(type: 'action' | 'verite'): GameCard | null {
    const availableCards = this.getAvailableCards(type);
    
    if (availableCards.length === 0) {
      // Aucune carte disponible - réinitialiser les cartes pour ce joueur
      this.usedCards[this.currentPlayer.pseudo] = [];
      const resetCards = this.getAvailableCards(type);
      
      if (resetCards.length === 0) {
        return null; // Vraiment aucune carte disponible
      }
      
      return resetCards[Math.floor(Math.random() * resetCards.length)];
    }
    
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }

  chooseAction() {
    const card = this.drawCard('action');
    
    if (!card) {
      alert('Aucune action disponible !');
      return;
    }
    
    // Marquer la carte comme utilisée si non répétable
    if (!card.repetable) {
      this.usedCards[this.currentPlayer.pseudo].push(card.id);
    }
    
    // Traiter la description avec les noms des joueurs
    const processedDescription = this.processCardDescription(card);
    
    // Reset compteur de vérités
    this.consecutiveVerites = 0;
    
    // Afficher la carte
    this.currentCard = { ...card, description: processedDescription };
    this.showCard = true;
  }

  chooseVerite() {
    if (this.mustChooseAction) {
      alert('Tu dois choisir une Action ! (3 vérités consécutives atteintes)');
      return;
    }

    const card = this.drawCard('verite');
    
    if (!card) {
      alert('Aucune vérité disponible !');
      return;
    }
    
    // Marquer la carte comme utilisée si non répétable
    if (!card.repetable) {
      this.usedCards[this.currentPlayer.pseudo].push(card.id);
    }
    
    // Traiter la description avec les noms des joueurs
    const processedDescription = this.processCardDescription(card);
    
    // Incrémenter compteur de vérités
    this.consecutiveVerites++;
    
    // Afficher la carte
    this.currentCard = { ...card, description: processedDescription };
    this.showCard = true;
  }

  closeCard() {
    this.showCard = false;
    this.currentCard = null;
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