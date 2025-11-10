import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-dashboard-main',
  imports: [CommonModule, PageContainerComponent],
  template: `
    <vrx-page-container title="Dashboard" subtitle="Overview of your security management">
      <div class="dashboard-content">
        <p>Welcome to the vRx Management Portal Dashboard</p>
        <!-- Dashboard widgets and content will go here -->
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .dashboard-content {
      padding: 24px;
    }
  `],
})
export class DashboardMainComponent {}
