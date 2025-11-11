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
  styleUrl: './assets-main.scss',
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
