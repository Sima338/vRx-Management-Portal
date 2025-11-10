import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vrx-page-container',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ title }}</h1>
        <p *ngIf="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </header>
      <div class="page-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #666666;
      margin: 8px 0 0 0;
    }

    .page-content {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e5e7;
    }
  `],
})
export class PageContainerComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}
