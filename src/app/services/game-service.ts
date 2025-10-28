import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {Player, PlayerGender} from '../models/player.model';
import { GameSession } from '../models/game-session.model';
import { Card, cardType } from '../models/card.model';
import { GameMode } from '../models/game-mode.model';
import { Photo } from '../models/photo.model';
import { StorageService } from './storage-service';

interface CardsDatabase {
  cards: Card[];
  modes: GameMode[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Storage keys
  private readonly STORAGE_KEYS = {
    PLAYERS: 'players',
    GAME_SESSION: 'gameSession',
    PHOTOS: 'photos',
    UNLOCKED_MODES: 'unlockedModes'
  };

  // Observables for reactive state management
  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$: Observable<Player[]> = this.playersSubject.asObservable();

  private gameSessionSubject = new BehaviorSubject<GameSession | null>(null);
  public gameSession$: Observable<GameSession | null> = this.gameSessionSubject.asObservable();

  private photosSubject = new BehaviorSubject<Photo[]>([]);
  public photos$: Observable<Photo[]> = this.photosSubject.asObservable();

  // Card database and game modes loaded from JSON
  private cardsDatabase: Card[] = [];
  private gameModes: GameMode[] = [];

  // Track if database is loaded
  private isDatabaseLoaded = false;
  private databaseLoadPromise: Promise<void> | null = null;

  private storageService = inject(StorageService);
  private http = inject(HttpClient);

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize service by loading database and initial data
   */
  private async initializeService(): Promise<void> {
    await this.loadDatabase();
    await this.loadInitialData();
  }

  /**
   * Load cards and modes from JSON file
   */
  private async loadDatabase(): Promise<void> {
    // Prevent multiple simultaneous loads
    if (this.databaseLoadPromise) {
      return this.databaseLoadPromise;
    }

    if (this.isDatabaseLoaded) {
      return;
    }

    this.databaseLoadPromise = (async () => {
      try {
        const database = await firstValueFrom(
          this.http.get<CardsDatabase>('assets/data/cards-database.json')
        );

        this.cardsDatabase = database.cards || [];
        this.gameModes = database.modes || [];
        this.isDatabaseLoaded = true;

        console.log(`Loaded ${this.cardsDatabase.length} cards and ${this.gameModes.length} modes`);
      } catch (error) {
        console.error('Error loading cards database:', error);
        // Fallback to empty arrays
        this.cardsDatabase = [];
        this.gameModes = [];
        throw new Error('Failed to load game database');
      }
    })();

    return this.databaseLoadPromise;
  }

  /**
   * Ensure database is loaded before operations
   */
  private async ensureDatabaseLoaded(): Promise<void> {
    if (!this.isDatabaseLoaded) {
      await this.loadDatabase();
    }
  }

  /**
   * Load initial data from storage
   */
  private async loadInitialData(): Promise<void> {
    await this.loadPlayers();
    await this.loadPhotos();
    await this.loadUnlockedModes();
  }

  // ===== PLAYER MANAGEMENT =====

  async loadPlayers(): Promise<void> {
    const players = await this.storageService.get<Player[]>(this.STORAGE_KEYS.PLAYERS);
    this.playersSubject.next(players || []);
  }

  async addPlayer(player: Player): Promise<void> {
    const currentPlayers = this.playersSubject.value;
    const updatedPlayers = [...currentPlayers, player];
    await this.storageService.set(this.STORAGE_KEYS.PLAYERS, updatedPlayers);
    this.playersSubject.next(updatedPlayers);
  }

  async removePlayer(playerId: string): Promise<void> {
    const currentPlayers = this.playersSubject.value;
    const updatedPlayers = currentPlayers.filter(p => p.id !== playerId);
    await this.storageService.set(this.STORAGE_KEYS.PLAYERS, updatedPlayers);
    this.playersSubject.next(updatedPlayers);
  }

  async clearPlayers(): Promise<void> {
    await this.storageService.remove(this.STORAGE_KEYS.PLAYERS);
    this.playersSubject.next([]);
  }

  getPlayers(): Player[] {
    return this.playersSubject.value;
  }

  // ===== GAME SESSION MANAGEMENT =====

  async startNewSession(players: Player[], modeId: string): Promise<void> {
    await this.ensureDatabaseLoaded();

    const newSession: GameSession = {
      players: players.map(p => ({ ...p, playerCardIds: [] })),
      currentPlayerIndex: 0,
      selectedMode: modeId,
      consecutiveTruths: 0,
      playedCards: new Map()
    };

    await this.storageService.set(this.STORAGE_KEYS.GAME_SESSION, newSession);
    this.gameSessionSubject.next(newSession);
  }

  async loadGameSession(): Promise<GameSession | null> {
    const session = await this.storageService.get<GameSession>(this.STORAGE_KEYS.GAME_SESSION);
    this.gameSessionSubject.next(session);
    return session;
  }

  async updateGameSession(session: GameSession): Promise<void> {
    await this.storageService.set(this.STORAGE_KEYS.GAME_SESSION, session);
    this.gameSessionSubject.next(session);
  }

  async endSession(): Promise<void> {
    await this.storageService.remove(this.STORAGE_KEYS.GAME_SESSION);
    this.gameSessionSubject.next(null);
  }

  getCurrentSession(): GameSession | null {
    return this.gameSessionSubject.value;
  }

  // ===== CARD MANAGEMENT =====

  /**
   * Draw a random card based on filters
   * @param modeId - Game mode
   * @param cardType - Action or truth
   * @param playerGender - Current player gender
   * @param playedCardIds - Cards already played by current player
   * @returns Random card or null if no cards available
   */
  async drawCard(
    modeId: string,
    cardType: cardType,
    playerGender: PlayerGender,
    playedCardIds: string[]
  ): Promise<Card | null> {
    await this.ensureDatabaseLoaded();

    const availableCards = this.cardsDatabase.filter(card => {
      // Must match mode
      if (card.mode !== modeId) return false;

      // Must match card type
      if (card.cardType !== cardType) return false;

      // Must match player gender or be for all
      if (card.player1Gender !== PlayerGender.all && card.player1Gender !== playerGender) {
        return false;
      }

      // If not repeatable, must not be in played cards
      if (!card.isRepeatable && playedCardIds.includes(card.id)) {
        return false;
      }

      return true;
    });

    if (availableCards.length === 0) {
      return null;
    }

    // Return random card
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  }

  /**
   * Get total number of available cards for given criteria
   */
  async getAvailableCardCount(
    modeId: string,
    cardType: cardType,
    playerGender: PlayerGender
  ): Promise<number> {
    await this.ensureDatabaseLoaded();

    return this.cardsDatabase.filter(card => {
      if (card.mode !== modeId) return false;
      if (card.cardType !== cardType) return false;
      if (card.player1Gender !== PlayerGender.all && card.player1Gender !== playerGender) {
        return false;
      }
      return true;
    }).length;
  }

  /**
   * Replace Player1 and Player2 placeholders in card description
   */
  formatCardDescription(card: Card, player1Name: string, player2Name?: string): string {
    let description = card.description.replace(/Player1/g, player1Name);

    if (player2Name) {
      description = description.replace(/Player2/g, player2Name);
    }

    return description;
  }

  /**
   * Select a random player matching the required gender (excluding current player)
   */
  selectPlayer2(
    currentPlayerId: string,
    requiredGender: PlayerGender,
    allPlayers: Player[]
  ): Player | null {
    const eligiblePlayers = allPlayers.filter(p => {
      if (p.id === currentPlayerId) return false;
      if (requiredGender === PlayerGender.all) return true;
      return p.gender === requiredGender;
    });

    if (eligiblePlayers.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
    return eligiblePlayers[randomIndex];
  }

  // ===== GAME MODES =====

  async getAvailableModes(): Promise<GameMode[]> {
    await this.ensureDatabaseLoaded();
    return [...this.gameModes];
  }

  async getModeById(modeId: string): Promise<GameMode | undefined> {
    await this.ensureDatabaseLoaded();
    return this.gameModes.find(m => m.id === modeId);
  }

  async unlockPremiumMode(modeId: string): Promise<void> {
    await this.ensureDatabaseLoaded();

    const mode = this.gameModes.find(m => m.id === modeId);
    if (mode) {
      mode.isLocked = false;

      // Save unlocked modes
      const unlockedModes = await this.storageService.get<string[]>(this.STORAGE_KEYS.UNLOCKED_MODES) || [];
      if (!unlockedModes.includes(modeId)) {
        unlockedModes.push(modeId);
        await this.storageService.set(this.STORAGE_KEYS.UNLOCKED_MODES, unlockedModes);
      }
    }
  }

  private async loadUnlockedModes(): Promise<void> {
    const unlockedModes = await this.storageService.get<string[]>(this.STORAGE_KEYS.UNLOCKED_MODES) || [];

    // Wait for database to load before applying unlocked modes
    await this.ensureDatabaseLoaded();

    unlockedModes.forEach(modeId => {
      const mode = this.gameModes.find(m => m.id === modeId);
      if (mode) {
        mode.isLocked = false;
      }
    });
  }

  /**
   * Check if a specific mode is unlocked
   */
  async isModeUnlocked(modeId: string): Promise<boolean> {
    await this.ensureDatabaseLoaded();
    const mode = this.gameModes.find(m => m.id === modeId);
    return mode ? !mode.isLocked : false;
  }

  // ===== PHOTO MANAGEMENT =====

  async loadPhotos(): Promise<void> {
    const photos = await this.storageService.get<Photo[]>(this.STORAGE_KEYS.PHOTOS) || [];
    this.photosSubject.next(photos);
  }

  async savePhoto(photo: Photo): Promise<void> {
    const currentPhotos = this.photosSubject.value;
    const updatedPhotos = [...currentPhotos, photo];
    await this.storageService.set(this.STORAGE_KEYS.PHOTOS, updatedPhotos);
    this.photosSubject.next(updatedPhotos);
  }

  async deletePhoto(photoId: string): Promise<void> {
    const currentPhotos = this.photosSubject.value;
    const updatedPhotos = currentPhotos.filter(p => p.id !== photoId);
    await this.storageService.set(this.STORAGE_KEYS.PHOTOS, updatedPhotos);
    this.photosSubject.next(updatedPhotos);
  }

  async clearPhotos(): Promise<void> {
    await this.storageService.remove(this.STORAGE_KEYS.PHOTOS);
    this.photosSubject.next([]);
  }

  getPhotos(): Photo[] {
    return this.photosSubject.value;
  }

  // ===== DATABASE MANAGEMENT =====

  /**
   * Force reload the database (useful for testing or updates)
   */
  async reloadDatabase(): Promise<void> {
    this.isDatabaseLoaded = false;
    this.databaseLoadPromise = null;
    await this.loadDatabase();
  }

  /**
   * Get database loading status
   */
  isDatabaseReady(): boolean {
    return this.isDatabaseLoaded;
  }
}
