import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  AlertController
} from '@ionic/angular/standalone';
import { v4 as uuidv4 } from 'uuid';
import { Player, playerGender } from '../models/player.model';

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
export class HomePage implements OnInit {
  pseudo: string = '';
  genre: string = '';
  players: Player[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadPlayers();
  }

  private loadPlayers() {
    try {
      const storedPlayers = localStorage.getItem('players');
      if (storedPlayers) {
        this.players = JSON.parse(storedPlayers);
      }
    } catch (error) {
      console.error('Error loading players from storage:', error);
      this.players = [];
    }
  }

  private savePlayers() {
    try {
      localStorage.setItem('players', JSON.stringify(this.players));
    } catch (error) {
      console.error('Error saving players to storage:', error);
      this.showError('Problème technique lors de la sauvegarde du joueur');
    }
  }

  addPlayer() {
    if (!this.pseudo || !this.genre) {
      this.showError('Veuillez entrer un pseudo et un genre');
      return;
    }

    // Check for duplicate nicknames
    if (this.players.some(p => p.name.toLowerCase() === this.pseudo.toLowerCase())) {
      this.showError('Un joueur avec ce pseudo existe déjà');
      return;
    }

    const newPlayer: Player = {
      id: uuidv4(),
      name: this.pseudo,
      gender: this.genre === 'homme' ? playerGender.male : playerGender.female,
      playerCardIds: []
    };

    this.players.push(newPlayer);
    this.savePlayers();

    // Reset form
    this.pseudo = '';
    this.genre = '';
  }

  removePlayer(index: number) {
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
      this.savePlayers();
    }
  }

  async startGame() {
    if (this.players.length < 2) {
      await this.showError('Ajoutez au moins deux joueurs pour commencer la partie');
      return;
    }
      this.navigateToMode();
  }

  private navigateToMode() {
    this.router.navigate(['/mode']);
  }

  private async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  protected readonly playerGender = playerGender;
}
