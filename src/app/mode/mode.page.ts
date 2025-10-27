import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonButton, 
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.page.html',
  styleUrls: ['./mode.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class ModePage {
  players: { pseudo: string; genre: string }[] = [];
  selectedMode: string = '';

  gameModes = [
    {
      id: 'classique',
      name: 'Classique',
      description: 'Le mode traditionnel pour tous les âges. Questions amusantes et défis sympas.',
      intensity: 'Douce',
      color: '#4CAF50',
      isPremium: false
    },
    {
      id: 'soiree',
      name: 'En soirée',
      description: 'Mode festif pour animer vos soirées entre amis. Plus d\'audace et de fun !',
      intensity: 'Modérée',
      color: '#FF9800',
      isPremium: false
    },
    {
      id: 'extreme',
      name: 'Extrême',
      description: 'Pour les plus courageux ! Questions corsées et défis osés.',
      intensity: 'Intense',
      color: '#F44336',
      isPremium: true
    }
  ];

  constructor(private router: Router) {
    // Récupérer les joueurs depuis le localStorage
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
    }
    
    // Rediriger vers l'accueil si pas assez de joueurs
    if (this.players.length < 2) {
      this.router.navigate(['/home']);
    }
  }

  selectMode(modeId: string) {
    const mode = this.gameModes.find(m => m.id === modeId);
    if (mode && !mode.isPremium) {
      this.selectedMode = modeId;
    }
  }

  showPremiumMessage() {
    // Pour l'instant, juste un message - plus tard on pourra ajouter une modal ou redirection vers paiement
    alert('Ce mode nécessite la version premium de l\'application !');
  }

  startGame() {
    if (this.selectedMode && this.players.length >= 2) {
      // Sauvegarder le mode sélectionné
      localStorage.setItem('gameMode', this.selectedMode);
      // Naviguer vers la page de jeu (à créer)
      this.router.navigate(['/game']);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}