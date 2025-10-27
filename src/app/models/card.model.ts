export enum cardPlayerGender {
  male = 'Homme',
  female = 'Femme',
  all = 'Tous'
}

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
  player1Gender: cardPlayerGender;
  player2Gender?: cardPlayerGender; // Optional, for cards requiring a second player
  timer?: number;
  isRepeatable: boolean; // Can be played multiple times
  requiresPhoto: boolean; // If true, must take a photo to validate the card
}
