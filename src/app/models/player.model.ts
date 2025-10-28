export enum PlayerGender {
  male = 'Homme',
  female = 'Femme',
  all = 'Tous',
}

export interface Player {
  id: string;
  name: string;
  gender: PlayerGender;
  playerCardIds: string[]; // Track cards already played by this player
}
