import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-findings-main',
  imports: [CommonModule, PageContainerComponent],
  template: `
    <vrx-page-container title="Findings" subtitle="Security findings and vulnerability reports">
      <div class="findings-content">
        <p>View and manage security findings and vulnerability reports</p>
        <!-- Findings list and analysis tools will go here -->
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .findings-content {
      padding: 24px;
    }
  `],
})
export class FindingsMainComponent {}
