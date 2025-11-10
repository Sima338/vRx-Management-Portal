import { Component } from '@angular/core';
import { AssetsMainComponent } from '../components/assets-main/assets-main';

@Component({
  imports: [AssetsMainComponent],
  selector: 'vrx-assets-entry',
  template: `<vrx-assets-main></vrx-assets-main>`,
})
export class RemoteEntry {}
