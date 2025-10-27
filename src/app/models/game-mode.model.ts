export interface GameMode {
  id: string;
  name: string;
  isPremium: boolean;
  isLocked: boolean; // True if premium and not paid
}
