import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageContainerComponent, TableComponent, ButtonComponent, TableColumn, TableActionEvent } from '@vrx-mf/ui-kit';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vrx-assets-main',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent, FormsModule],
  templateUrl: './assets-main.html',
  styles: [`
    .assets-content {
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

    .stat-card.active {
      border-left: 4px solid #10b981;
    }

    .stat-card.high-risk {
      border-left: 4px solid #f59e0b;
    }

    .stat-card.critical {
      border-left: 4px solid #dc2626;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-card.total .stat-number {
      color: #007aff;
    }

    .stat-card.active .stat-number {
      color: #10b981;
    }

    .stat-card.high-risk .stat-number {
      color: #f59e0b;
    }

    .stat-card.critical .stat-number {
      color: #dc2626;
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
      min-width: 160px;
    }

    .filter-group label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .filter-select {
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

    .filter-select:focus {
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
export class AssetsMainComponent implements OnInit {
  private assetService = inject(AssetService);
  private router = inject(Router);

  // Signals for reactive state management
  loading = signal(false);
  error = signal<string | null>(null);
  selectedType = signal<Asset['type'] | 'all'>('all');
  selectedStatus = signal<Asset['status'] | 'all'>('all');
  selectedEnvironment = signal<Asset['environment'] | 'all'>('all');
  selectedRiskLevel = signal<string>('all');

  // Computed signals
  assets = computed(() => this.assetService.assets());
  stats = computed(() => this.assetService.getStatistics());
  
  filteredAssets = computed(() => {
    return this.assetService.filterAssets({
      type: this.selectedType() !== 'all' ? this.selectedType() : undefined,
      status: this.selectedStatus() !== 'all' ? this.selectedStatus() : undefined,
      environment: this.selectedEnvironment() !== 'all' ? this.selectedEnvironment() : undefined,
      riskLevel: this.selectedRiskLevel() !== 'all' ? this.selectedRiskLevel() : undefined
    });
  });

  tableColumns: TableColumn[] = [
    { 
      key: 'name', 
      label: 'Asset Name', 
      type: 'text',
      sortable: true 
    },
    { 
      key: 'type', 
      label: 'Type', 
      type: 'badge',
      width: '120px',
      sortable: true 
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      width: '100px',
      sortable: true 
    },
    { 
      key: 'environment', 
      label: 'Environment', 
      type: 'badge',
      width: '120px',
      sortable: true 
    },
    { 
      key: 'owner', 
      label: 'Owner', 
      type: 'text',
      width: '150px' 
    },
    { 
      key: 'vulnerabilityCount', 
      label: 'Vulnerabilities', 
      type: 'text',
      width: '120px',
      sortable: true 
    },
    { 
      key: 'riskScore', 
      label: 'Risk Score', 
      type: 'text',
      width: '100px',
      sortable: true 
    },
    { 
      key: 'lastScanned', 
      label: 'Last Scanned', 
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
    { action: 'view-details', label: 'View Details', class: 'action-view-details' }
  ];

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.loading.set(true);
    this.error.set(null);

    this.assetService.loadAssets()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (assets) => {
          this.assetService.assets.set(assets);
        },
        error: (error) => {
          this.error.set('Failed to load assets. Please try again.');
          console.error('Error loading assets:', error);
        }
      });
  }

  onFilterChange() {
    // Computed signal will automatically update filteredAssets
  }

  clearFilters() {
    this.selectedType.set('all');
    this.selectedStatus.set('all');
    this.selectedEnvironment.set('all');
    this.selectedRiskLevel.set('all');
  }

  handleTableAction(event: TableActionEvent) {
    const { action, item } = event;
    const asset = item as Asset;
    
    if (action === 'view-details') {
      this.viewAssetDetails(asset);
    }
  }

  handleRowClick(event: { item: unknown; index: number }) {
    const asset = event.item as Asset;
    this.viewAssetDetails(asset);
  }

  viewAssetDetails(asset: Asset) {
    this.router.navigate(['/assets', asset.id]);
  }
}
