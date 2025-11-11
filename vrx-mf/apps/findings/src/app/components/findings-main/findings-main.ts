import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent, TableComponent, ButtonComponent } from '@vrx-mf/ui-kit';
import { FindingsService, Finding } from '../../services/findings.service';
import { finalize } from 'rxjs/operators';

interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'avatar' | 'badge' | 'date' | 'actions';
  sortable?: boolean;
  width?: string;
}

interface TableActionEvent {
  action: string;
  item: unknown;
  index: number;
}

@Component({
  selector: 'vrx-findings-main',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent, FormsModule],
  template: `
    <vrx-page-container 
      title="Security Findings" 
      subtitle="Vulnerability reports and security analysis">
      
      <div class="findings-content">
        
        <!-- Error Display -->
        <div *ngIf="error()" class="error-message">
          <span>{{ error() }}</span>
          <button class="retry-btn" (click)="loadFindings()">Retry</button>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-number">{{ stats().total }}</div>
            <div class="stat-label">Total Findings</div>
          </div>
          <div class="stat-card critical">
            <div class="stat-number">{{ stats().critical }}</div>
            <div class="stat-label">Critical</div>
          </div>
          <div class="stat-card high">
            <div class="stat-number">{{ stats().high }}</div>
            <div class="stat-label">High</div>
          </div>
          <div class="stat-card open">
            <div class="stat-number">{{ stats().open }}</div>
            <div class="stat-label">Open</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="filter-group">
            <label for="severityFilter">Filter by Severity:</label>
            <select id="severityFilter" [(ngModel)]="selectedSeverity" (ngModelChange)="onFilterChange()" class="filter-select">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="statusFilter">Filter by Status:</label>
            <select id="statusFilter" [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()" class="filter-select">
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>

          <div class="filter-actions">
            <vrx-button 
              variant="secondary" 
              (clicked)="clearFilters()">
              Clear Filters
            </vrx-button>
          </div>
        </div>

        <!-- Findings Table -->
        <div class="table-section">
          <div *ngIf="loading()" class="loading-state">
            <div class="loading-spinner"></div>
            <span>Loading findings...</span>
          </div>
          
          <vrx-table 
            *ngIf="!loading()"
            [columns]="tableColumns"
            [data]="filteredFindings()"
            [actions]="tableActions"
            [showSearch]="true"
            [searchPlaceholder]="'Search'"
            [searchColumns]="['title', 'description']"
            (actionClicked)="handleTableAction($event)">
          </vrx-table>
        </div>

      </div>
    </vrx-page-container>
  `,
  styles: [`
    .findings-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 24px;
    }

    /* Error Message */
    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      color: #dc2626;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .retry-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .retry-btn:hover {
      background: #b91c1c;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-card.total {
      border-left: 4px solid #007aff;
    }

    .stat-card.critical {
      border-left: 4px solid #dc2626;
    }

    .stat-card.high {
      border-left: 4px solid #f59e0b;
    }

    .stat-card.open {
      border-left: 4px solid #10b981;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-card.total .stat-number {
      color: #007aff;
    }

    .stat-card.critical .stat-number {
      color: #dc2626;
    }

    .stat-card.high .stat-number {
      color: #f59e0b;
    }

    .stat-card.open .stat-number {
      color: #10b981;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    /* Filters Section */
    .filters-section {
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e5e5e7;
      display: flex;
      gap: 20px;
      align-items: end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 180px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .filter-select, .form-select {
      padding: 12px 40px 12px 16px;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 20px 20px;
    }

    .filter-select:focus, .form-select:focus {
      outline: none;
      border-color: #007aff;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }

    .filter-actions {
      display: flex;
      align-items: center;
    }

    /* Table Section */
    .table-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e5e7;
      min-height: 200px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
      gap: 16px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007aff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        min-width: auto;
      }

      .filter-actions {
        justify-content: flex-start;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class FindingsMainComponent implements OnInit {
  private findingsService = inject(FindingsService);

  // Signals for reactive state management
  loading = signal(false);
  error = signal<string | null>(null);
  selectedSeverity = signal<Finding['severity'] | 'all'>('all');
  selectedStatus = signal<Finding['status'] | 'all'>('all');

  // Computed signals
  findings = computed(() => this.findingsService.findings());
  stats = computed(() => this.findingsService.getStatistics());
  
  filteredFindings = computed(() => {
    let filtered = this.findings();
    
    if (this.selectedSeverity() !== 'all') {
      filtered = filtered.filter(f => f.severity === this.selectedSeverity());
    }
    
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(f => f.status === this.selectedStatus());
    }
    
    return filtered;
  });

  tableColumns: TableColumn[] = [
    { 
      key: 'severity', 
      label: 'Severity', 
      type: 'badge',
      width: '100px',
      sortable: true 
    },
    { 
      key: 'title', 
      label: 'Title', 
      type: 'text',
      sortable: true 
    },
    { 
      key: 'assetId', 
      label: 'Asset', 
      type: 'text',
      width: '100px' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      width: '120px',
      sortable: true 
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      type: 'date',
      width: '140px',
      sortable: true 
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions',
      width: '120px' 
    }
  ];

  tableActions = [
    { action: 'view-details', label: 'View Details', icon: '👁️' }
  ];

  ngOnInit() {
    this.loadFindings();
  }

  loadFindings() {
    this.loading.set(true);
    this.error.set(null);

    this.findingsService.loadFindings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (findings) => {
          this.findingsService.findings.set(findings);
        },
        error: (error) => {
          this.error.set('Failed to load findings. Please try again.');
          console.error('Error loading findings:', error);
        }
      });
  }

  onFilterChange() {
    // Computed signal will automatically update filteredFindings
  }

  clearFilters() {
    this.selectedSeverity.set('all');
    this.selectedStatus.set('all');
  }

  handleTableAction(event: TableActionEvent) {
    const { action, item } = event;
    const finding = item as Finding;
    
    if (action === 'view-details') {
      this.viewDetails(finding);
    }
  }

  viewDetails(finding: Finding) {
    console.log('View details for finding:', finding);
    // In a real app, this would navigate to a detail view or open a modal
    alert(`Viewing details for: ${finding.title}\n\nDescription: ${finding.description || 'No description available'}`);
  }
}
