import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vrx-risk-chart',
  imports: [CommonModule],
  template: `
    <div class="chart" [ngClass]="chartClass">
      <div class="chart-circle">
        <div class="chart-number">{{ value }}</div>
        <div class="chart-label">{{ label }}</div>
      </div>
      <div class="chart-title">{{ title }}</div>
    </div>
  `,
  styles: [`
    .chart {
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e7;
    }

    .chart-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      position: relative;
    }

    .high-risk-chart .chart-circle {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
    }

    .med-risk-chart .chart-circle {
      background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
      color: white;
    }

    .low-risk-chart .chart-circle {
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      color: #6b7280;
    }

    .chart-number {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    .chart-label {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .chart-title {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  `],
})
export class RiskChartComponent {
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() title = '';
  @Input() chartClass = '';
}
