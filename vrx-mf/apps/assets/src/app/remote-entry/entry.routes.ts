import { Route } from '@angular/router';
import { RemoteEntry } from './entry';

export const remoteRoutes: Route[] = [
  { 
    path: '', 
    component: RemoteEntry,
    children: [
      {
        path: '',
        loadComponent: () => 
          import('../components/assets-main/assets-main').then(m => m.AssetsMainComponent)
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../components/asset-details/asset-details').then(m => m.AssetDetailsComponent)
      }
    ]
  }
];
