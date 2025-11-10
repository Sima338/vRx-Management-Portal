import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vrx-summary-card',
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-icon" [ngClass]="iconClass">
        {{ icon }}
      </div>
      <div class="card-content">
        <div class="card-title">{{ title }}</div>
        <div class="card-value">{{ value }}</div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e7;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .apps-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .assets-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .systems-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
    }
  `],
})
export class SummaryCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() iconClass = '';
}
