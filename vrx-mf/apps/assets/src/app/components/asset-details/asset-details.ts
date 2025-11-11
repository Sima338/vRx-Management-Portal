import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageContainerComponent, TableComponent, ButtonComponent } from '@vrx-mf/ui-kit';
import { AssetService, AssetDetails, Vulnerability } from '../../services/asset.service';
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
  selector: 'vrx-asset-details',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent],
  template: `
    <vrx-page-container 
      [title]="asset()?.name || 'Asset Details'" 
      [subtitle]="'Detailed view and vulnerability analysis'">
      
      <div class="asset-details-content">
        
        <!-- Error Display -->
        <div *ngIf="error()" class="error-message">
          <span>{{ error() }}</span>
          <button class="retry-btn" (click)="loadAssetDetails()">Retry</button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading()" class="loading-state">
          <div class="loading-spinner"></div>
          <span>Loading asset details...</span>
        </div>

        <!-- Asset Details -->
        <div *ngIf="!loading() && asset()" class="asset-info">
          
          <!-- Back Navigation -->
          <div class="navigation">
            <vrx-button 
              variant="secondary" 
              icon="←"
              (clicked)="goBack()">
              Back to Assets
            </vrx-button>
          </div>

          <!-- Asset Overview -->
          <div class="asset-overview">
            <div class="overview-header">
              <h2>{{ asset()!.name }}</h2>
              <div class="asset-badges">
                <span class="badge" [ngClass]="'badge-' + asset()!.type">{{ asset()!.type }}</span>
                <span class="badge" [ngClass]="'badge-' + asset()!.status">{{ asset()!.status }}</span>
                <span class="badge" [ngClass]="'badge-' + asset()!.environment">{{ asset()!.environment }}</span>
              </div>
            </div>
            
            <div class="overview-grid">
              <div class="info-card">
                <div class="info-label">Owner</div>
                <div class="info-value">{{ asset()!.owner }}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Risk Score</div>
                <div class="info-value" [ngClass]="getRiskScoreClass(asset()!.riskScore)">
                  {{ asset()!.riskScore || 'N/A' }}
                </div>
              </div>
              <div class="info-card">
                <div class="info-label">Location</div>
                <div class="info-value">{{ asset()!.location || 'N/A' }}</div>
              </div>
              <div class="info-card">
                <div class="info-label">IP Address</div>
                <div class="info-value">{{ asset()!.ipAddress || 'N/A' }}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Operating System</div>
                <div class="info-value">{{ asset()!.operatingSystem || 'N/A' }}</div>
              </div>
              <div class="info-card">
                <div class="info-label">Last Scanned</div>
                <div class="info-value">{{ formatDate(asset()!.lastScanned) }}</div>
              </div>
            </div>

            <!-- Tags -->
            <div *ngIf="asset()!.tags && asset()!.tags!.length > 0" class="tags-section">
              <div class="tags-label">Tags:</div>
              <div class="tags">
                <span *ngFor="let tag of asset()!.tags" class="tag">{{ tag }}</span>
              </div>
            </div>

            <!-- Description -->
            <div *ngIf="asset()!.metadata?.description" class="description-section">
              <div class="description-label">Description:</div>
              <p class="description">{{ asset()!.metadata!.description }}</p>
            </div>
          </div>

          <!-- Vulnerability Statistics -->
          <div class="vulnerability-stats">
            <div class="stats-header">
              <h3>Vulnerability Overview</h3>
              <vrx-button 
                variant="primary" 
                icon="🔍"
                (clicked)="scanAsset()">
                Rescan Asset
              </vrx-button>
            </div>
            
            <div class="vuln-stats-grid">
              <div class="vuln-stat critical">
                <div class="vuln-number">{{ getVulnerabilityCountBySeverity('critical') }}</div>
                <div class="vuln-label">Critical</div>
              </div>
              <div class="vuln-stat high">
                <div class="vuln-number">{{ getVulnerabilityCountBySeverity('high') }}</div>
                <div class="vuln-label">High</div>
              </div>
              <div class="vuln-stat medium">
                <div class="vuln-number">{{ getVulnerabilityCountBySeverity('medium') }}</div>
                <div class="vuln-label">Medium</div>
              </div>
              <div class="vuln-stat low">
                <div class="vuln-number">{{ getVulnerabilityCountBySeverity('low') }}</div>
                <div class="vuln-label">Low</div>
              </div>
            </div>
          </div>

          <!-- Vulnerabilities Table -->
          <div class="vulnerabilities-section">
            <h3>Vulnerabilities</h3>
            
            <div *ngIf="asset()!.vulnerabilities.length === 0" class="no-vulnerabilities">
              <div class="no-vuln-icon">✅</div>
              <h4>No Vulnerabilities Found</h4>
              <p>This asset is currently clean with no known security vulnerabilities.</p>
            </div>

            <vrx-table 
              *ngIf="asset()!.vulnerabilities.length > 0"
              [columns]="vulnerabilityColumns"
              [data]="asset()!.vulnerabilities"
              [actions]="vulnerabilityActions"
              [showSearch]="true"
              [searchPlaceholder]="'Search vulnerabilities...'"
              [searchColumns]="['description', 'cve']"
              (actionClicked)="handleVulnerabilityAction($event)">
            </vrx-table>
          </div>

        </div>
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .asset-details-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
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

    /* Loading State */
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

    /* Navigation */
    .navigation {
      margin-bottom: 16px;
    }

    /* Asset Overview */
    .asset-overview {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .overview-header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
      font-weight: 600;
    }

    .asset-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .badge-server { background: #dbeafe; color: #2563eb; }
    .badge-application { background: #e0e7ff; color: #6366f1; }
    .badge-database { background: #fef3c7; color: #d97706; }
    .badge-network { background: #ecfdf5; color: #10b981; }
    .badge-cloud { background: #f3e8ff; color: #8b5cf6; }
    .badge-active { background: #dcfce7; color: #16a34a; }
    .badge-inactive { background: #fee2e2; color: #dc2626; }
    .badge-maintenance { background: #fef3c7; color: #d97706; }
    .badge-production { background: #fee2e2; color: #dc2626; }
    .badge-staging { background: #fef3c7; color: #d97706; }
    .badge-development { background: #dcfce7; color: #16a34a; }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-card {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e5e5e7;
    }

    .info-label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .info-value {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }

    .risk-critical { color: #dc2626; }
    .risk-high { color: #f59e0b; }
    .risk-medium { color: #10b981; }
    .risk-low { color: #6b7280; }

    /* Tags */
    .tags-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .tags-label {
      font-weight: 600;
      color: #333;
    }

    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag {
      background: #f3f4f6;
      color: #374151;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Description */
    .description-section {
      margin-top: 16px;
    }

    .description-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .description {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Vulnerability Statistics */
    .vulnerability-stats {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stats-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .stats-header h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    .vuln-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .vuln-stat {
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e5e7;
    }

    .vuln-stat.critical {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .vuln-stat.high {
      background: #fffbeb;
      border-color: #fed7aa;
    }

    .vuln-stat.medium {
      background: #fefce8;
      border-color: #fde68a;
    }

    .vuln-stat.low {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .vuln-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .vuln-stat.critical .vuln-number {
      color: #dc2626;
    }

    .vuln-stat.high .vuln-number {
      color: #f59e0b;
    }

    .vuln-stat.medium .vuln-number {
      color: #d97706;
    }

    .vuln-stat.low .vuln-number {
      color: #16a34a;
    }

    .vuln-label {
      font-size: 14px;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
    }

    /* Vulnerabilities Section */
    .vulnerabilities-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e5e5e7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .vulnerabilities-section h3 {
      margin: 0 0 24px 0;
      color: #333;
      font-size: 20px;
      font-weight: 600;
    }

    /* No Vulnerabilities */
    .no-vulnerabilities {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-vuln-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .no-vulnerabilities h4 {
      color: #16a34a;
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .no-vulnerabilities p {
      margin: 0;
      color: #666;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .overview-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }

      .tags-section {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `],
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
