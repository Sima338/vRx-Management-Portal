import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageContainerComponent, TableComponent, ButtonComponent, TableColumn, TableActionEvent } from '@vrx-mf/ui-kit';
import { AssetService } from '../../services/asset.service';
import { AssetDetails, Vulnerability } from '../../models/asset.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vrx-asset-details',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent],
  templateUrl: './asset-details.html',
  styleUrl: './asset-details.scss',
})
export class AssetDetailsComponent implements OnInit {
  private assetService = inject(AssetService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals for reactive state management
  loading = signal(false);
  error = signal<string | null>(null);
  asset = signal<AssetDetails | null>(null);
  assetId = signal<string>('');

  vulnerabilityColumns: TableColumn[] = [
    { 
      key: 'severity', 
      label: 'Severity', 
      type: 'badge',
      width: '100px',
      sortable: true 
    },
    { 
      key: 'description', 
      label: 'Description', 
      type: 'text',
      sortable: true 
    },
    { 
      key: 'cve', 
      label: 'CVE', 
      type: 'text',
      width: '140px' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'badge',
      width: '120px',
      sortable: true 
    },
    { 
      key: 'discoveredAt', 
      label: 'Discovered', 
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

  vulnerabilityActions = [
    { action: 'mark-resolved', label: 'Mark Resolved', icon: '✅' },
    { action: 'false-positive', label: 'False Positive', icon: '❌' }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assetId.set(params['id']);
      this.loadAssetDetails();
    });
  }

  loadAssetDetails() {
    const id = this.assetId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.assetService.getAssetById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (asset) => {
          this.asset.set(asset);
        },
        error: (error) => {
          this.error.set('Failed to load asset details. Please try again.');
          console.error('Error loading asset details:', error);
        }
      });
  }

  goBack() {
    this.router.navigate(['/assets']);
  }

  scanAsset() {
    const asset = this.asset();
    if (!asset) return;

    console.log('Scanning asset:', asset);
    alert(`Initiating security scan for: ${asset.name}\n\nThis may take several minutes to complete.`);
  }

  handleVulnerabilityAction(event: TableActionEvent) {
    const { action, item } = event;
    const vulnerability = item as Vulnerability;
    
    if (action === 'mark-resolved') {
      this.markVulnerabilityResolved(vulnerability);
    } else if (action === 'false-positive') {
      this.markVulnerabilityFalsePositive(vulnerability);
    }
  }

  markVulnerabilityResolved(vulnerability: Vulnerability) {
    console.log('Marking vulnerability as resolved:', vulnerability);
    alert(`Marking vulnerability as resolved:\n${vulnerability.description}`);
  }

  markVulnerabilityFalsePositive(vulnerability: Vulnerability) {
    console.log('Marking vulnerability as false positive:', vulnerability);
    alert(`Marking vulnerability as false positive:\n${vulnerability.description}`);
  }

  getVulnerabilityCountBySeverity(severity: string): number {
    const asset = this.asset();
    if (!asset?.vulnerabilities) return 0;
    return asset.vulnerabilities.filter(v => v.severity === severity).length;
  }

  getRiskScoreClass(riskScore?: number): string {
    if (!riskScore) return '';
    if (riskScore >= 9) return 'risk-critical';
    if (riskScore >= 7) return 'risk-high';
    if (riskScore >= 4) return 'risk-medium';
    return 'risk-low';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }
}
