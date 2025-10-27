import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'mode',
    loadComponent: () => import('./mode/mode.page').then((m) => m.ModePage),
  },
  {
    path: 'game',
    loadComponent: () => import('./game/game.page').then((m) => m.GamePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
