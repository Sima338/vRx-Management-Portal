import { Component } from '@angular/core';
import { FindingsMainComponent } from '../components/findings-main/findings-main';

@Component({
  imports: [FindingsMainComponent],
  selector: 'vrx-findings-entry',
  template: `<vrx-findings-main></vrx-findings-main>`,
})
export class RemoteEntry {}
