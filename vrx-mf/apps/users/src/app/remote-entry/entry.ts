import { Component } from '@angular/core';
import { UserList } from '../components/users-list/user-list';

@Component({
  imports: [UserList],
  selector: 'vrx-users-entry',
  template: `<vrx-user-list></vrx-user-list>`,
})
export class RemoteEntry {}
