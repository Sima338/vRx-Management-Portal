import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskStat } from '../../models/card.models';

@Component({
  selector: 'vrx-risk-stats',
  imports: [CommonModule],
  template: `
    <div class="risk-section">
      <h3>{{ title }}</h3>
      <div class="risk-stats">
        <div class="risk-item" *ngFor="let stat of stats">
          <span class="risk-dot" [ngClass]="stat.type + '-risk'"></span>
          <span class="risk-label">{{ stat.label }}</span>
          <span class="risk-count">{{ stat.count }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .risk-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e7;
    }

    .risk-section h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .risk-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .risk-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .risk-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .high-risk {
      background: #ff6b6b;
    }

    .med-risk {
      background: #a78bfa;
    }

    .low-risk {
      background: #60a5fa;
    }

    .risk-label {
      flex: 1;
      font-size: 14px;
      color: #666;
    }

    .risk-count {
      font-weight: 600;
      color: #1a1a1a;
    }
  `],
})
export class RiskStatsComponent {
  @Input() title = '';
  @Input() stats: RiskStat[] = [];
}
