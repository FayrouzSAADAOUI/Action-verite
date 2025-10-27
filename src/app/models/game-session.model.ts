import {Player} from "./player.model";

export interface GameSession {
  players: Player[];
  currentPlayerIndex: number;
  selectedMode: string; // Mode ID
  consecutiveTruths: number; // Track consecutive truths for forcing action rule
  playedCards: Map<string, string[]>; // playerId -> cardIds played
}
