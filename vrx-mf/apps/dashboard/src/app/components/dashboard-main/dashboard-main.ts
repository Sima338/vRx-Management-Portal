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
  styleUrl: './dashboard-main.scss'
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
