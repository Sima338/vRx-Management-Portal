import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-assets-main',
  imports: [CommonModule, PageContainerComponent],
  template: `
    <vrx-page-container title="Assets" subtitle="Manage and monitor your digital assets">
      <div class="assets-content">
        <p>Manage your digital assets and security configurations</p>
        <!-- Assets list and management tools will go here -->
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .assets-content {
      padding: 24px;
    }
  `],
})
export class AssetsMainComponent {}
