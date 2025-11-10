import { Component } from '@angular/core';
import { UsersMainComponent } from '../components/users-main/users-main';

@Component({
  imports: [UsersMainComponent],
  selector: 'vrx-users-entry',
  template: `<vrx-users-main></vrx-users-main>`,
})
export class RemoteEntry {}
