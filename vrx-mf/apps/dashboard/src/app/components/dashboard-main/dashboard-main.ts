import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PageContainerComponent, 
  SummaryCardComponent, 
  RiskChartComponent, 
  RiskStatsComponent,
  RiskStat 
} from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-dashboard-main',
  imports: [
    CommonModule, 
    PageContainerComponent, 
    SummaryCardComponent, 
    RiskChartComponent, 
    RiskStatsComponent
  ],
  templateUrl: './dashboard-main.html',
  styles: [`
    .dashboard-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Summary Cards */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    /* Charts Section */
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-content {
        padding: 16px;
        gap: 24px;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class DashboardMainComponent {
  assetRiskStats: RiskStat[] = [
    { type: 'high', label: 'High Risk', count: 23 },
    { type: 'med', label: 'Med Risk', count: 0 },
    { type: 'low', label: 'Low Risk', count: 1 }
  ];

  assetStatusStats: RiskStat[] = [
    { type: 'low', label: 'Online', count: 0 },
    { type: 'high', label: 'Offline', count: 23 }
  ];
}
