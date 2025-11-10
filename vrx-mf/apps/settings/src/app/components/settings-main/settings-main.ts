import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-settings-main',
  imports: [CommonModule, PageContainerComponent],
  template: `
    <vrx-page-container title="Settings" subtitle="Configure your application preferences">
      <div class="settings-content">
        <p>Configure system settings and user preferences</p>
        <!-- Settings forms and configuration options will go here -->
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .settings-content {
      padding: 24px;
    }
  `],
})
export class SettingsMainComponent {}
