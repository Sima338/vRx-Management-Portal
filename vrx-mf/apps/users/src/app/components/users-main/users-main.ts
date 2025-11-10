import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-users-main',
  imports: [CommonModule, TableComponent, PageContainerComponent],
  template: `
    <vrx-page-container title="Users" subtitle="Manage user accounts and permissions">
      <div class="users-content">
        <vrx-table></vrx-table>
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .users-content {
      padding: 24px;
    }
  `],
})
export class UsersMainComponent {}
