import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'settings',
    loadChildren: () => import('settings/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'users',
    loadChildren: () => import('users/Routes').then((m) => m!.remoteRoutes),
  },
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
