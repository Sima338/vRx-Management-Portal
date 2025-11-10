import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'findings',
    loadChildren: () => import('findings/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'assets',
    loadChildren: () => import('assets/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('dashboard/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
];
