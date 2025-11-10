import { Component } from '@angular/core';
import { DashboardMainComponent } from '../components/dashboard-main/dashboard-main';

@Component({
  imports: [DashboardMainComponent],
  selector: 'vrx-dashboard-entry',
  template: `<vrx-dashboard-main></vrx-dashboard-main>`,
})
export class RemoteEntry {}
