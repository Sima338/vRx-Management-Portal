import { Component } from '@angular/core';
import { SettingsMainComponent } from '../components/settings-main/settings-main';

@Component({
  imports: [SettingsMainComponent],
  selector: 'vrx-settings-entry',
  template: `<vrx-settings-main></vrx-settings-main>`,
})
export class RemoteEntry {}
