import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'vrx-dashboard-entry',
  template: `<vrx-nx-welcome></vrx-nx-welcome>`,
})
export class RemoteEntry {}
