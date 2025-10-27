export interface Photo {
  id: string;
  timestamp: Date;
  dataUrl: string; // Base64 encoded image
  cardDescription: string; // Context of what the photo was for
  playerNames: string[]; // Players involved
}
