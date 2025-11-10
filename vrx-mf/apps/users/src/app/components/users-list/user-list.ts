import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-user-list',
  imports: [CommonModule, TableComponent, PageContainerComponent],
  template: `
    <vrx-page-container title="Users">
      <vrx-table></vrx-table>
    </vrx-page-container>
  `,
  styles: [],
})
export class UserList {}
