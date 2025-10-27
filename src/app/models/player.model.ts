export enum playerGender {
  male = 'Homme',
  female = 'Femme',
}

export interface Player {
  id: string;
  name: string;
  gender: playerGender;
  playerCardIds: string[]; // Track cards already played by this player
}
