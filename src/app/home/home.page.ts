import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import { 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton, 
  IonList 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonList
  ],
})
export class HomePage implements AfterViewInit {
  pseudo: string = '';
  genre: string = '';
  players: { pseudo: string; genre: string }[] = [];

  constructor(private router: Router) {
    // Charger les joueurs depuis le localStorage
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) this.players = JSON.parse(storedPlayers);
  }

  ngAfterViewInit() {
    // Configuration du clavier pour mobile
    if (Capacitor.isNativePlatform()) {
      Keyboard.setAccessoryBarVisible({ isVisible: true });
      Keyboard.setScroll({ isDisabled: false });
      Keyboard.setStyle({ style: KeyboardStyle.Light });
    }
  }

  onInputFocus() {
    // Forcer l'affichage du clavier sur mobile
    if (Capacitor.isNativePlatform()) {
      setTimeout(() => {
        Keyboard.show();
      }, 100);
    }
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
    if (this.players.length >= 2) {
      this.router.navigate(['/mode']);
    }
  }
}
