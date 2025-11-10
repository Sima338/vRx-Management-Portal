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
  template: `
    <vrx-page-container title="Dashboard" subtitle="Overview of your security management">
      <div class="dashboard-content">
        
        <!-- Summary Cards -->
        <div class="summary-cards">
          <vrx-summary-card
            title="Apps"
            value="2717"
            icon="📱"
            iconClass="apps-icon">
          </vrx-summary-card>
          
          <vrx-summary-card
            title="Assets"
            value="24"
            icon="🏢"
            iconClass="assets-icon">
          </vrx-summary-card>
          
          <vrx-summary-card
            title="Operating Systems"
            value="11"
            icon="⚙️"
            iconClass="systems-icon">
          </vrx-summary-card>
        </div>

        <!-- Risk Overview -->
        <vrx-risk-stats
          title="Asset Risk Level"
          [stats]="assetRiskStats">
        </vrx-risk-stats>

        <!-- Risk Charts -->
        <div class="charts-section">
          <vrx-risk-chart
            value="55"
            label="Apps"
            title="⚡ High Risk"
            chartClass="high-risk-chart">
          </vrx-risk-chart>
          
          <vrx-risk-chart
            value="16"
            label="Apps"
            title="⚠️ Med Risk"
            chartClass="med-risk-chart">
          </vrx-risk-chart>
          
          <vrx-risk-chart
            value="2646"
            label="Apps"
            title="✓ Low Risk"
            chartClass="low-risk-chart">
          </vrx-risk-chart>
        </div>

        <!-- Asset Status -->
        <vrx-risk-stats
          title="Asset Status"
          [stats]="assetStatusStats">
        </vrx-risk-stats>

      </div>
    </vrx-page-container>
  `,
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
