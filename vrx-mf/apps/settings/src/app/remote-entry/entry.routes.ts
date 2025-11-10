import { Route } from '@angular/router';
import { RemoteEntry } from './entry';
import { GeneralSettingsComponent } from '../components/general-settings/general-settings';
import { SecuritySettingsComponent } from '../components/security-settings/security-settings';
import { NotificationsSettingsComponent } from '../components/notifications-settings/notifications-settings';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralSettingsComponent
      },
      {
        path: 'security',
        component: SecuritySettingsComponent
      },
      {
        path: 'notifications',
        component: NotificationsSettingsComponent
      }
    ]
  }
];
