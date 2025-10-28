import {Component, inject, OnInit} from '@angular/core';
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
import { Player, PlayerGender } from '../models/player.model';
import {GameService} from "../services/game-service";

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

  private gameService = inject(GameService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  protected readonly playerGender = PlayerGender;

  pseudo: string = '';
  genre: string = '';
  players: Player[] = [];

  ngOnInit() {
    this.loadPlayers();
    this.gameService.players$.subscribe(players => {
      this.players = players;
    })
  }

  private loadPlayers() {
    try {
      this.players = this.gameService.getPlayers();
    } catch (error) {
      console.error('Error loading players from storage:', error);
      this.players = [];
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
      gender: this.genre === 'homme' ? PlayerGender.male : PlayerGender.female,
      playerCardIds: []
    };

    this.gameService.addPlayer(newPlayer);

    // Reset form
    this.pseudo = '';
    this.genre = '';
  }

  removePlayer(playerId: string) {
    this.gameService.removePlayer(playerId);
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

  removeAllPlayers() {
    this.gameService.clearPlayers();
  }
}
