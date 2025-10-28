import {PlayerGender} from "./player.model";

export enum cardType {
  action = 'action',
  truth = 'truth',
}

export interface Card {
  id: string;
  mode: string; // The mode id the card belongs to
  type: string;
  cardType: cardType;
  description: string;
  player1Gender: PlayerGender;
  player2Gender?: PlayerGender; // Optional, for cards requiring a second player
  timer?: number;
  isRepeatable: boolean; // Can be played multiple times
  requiresPhoto: boolean; // If true, must take a photo to validate the card
}
