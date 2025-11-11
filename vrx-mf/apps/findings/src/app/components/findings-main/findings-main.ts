import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent, TableComponent, ButtonComponent, TableColumn, TableActionEvent } from '@vrx-mf/ui-kit';
import { FindingsService } from '../../services/findings.service';
import { Finding } from '../../models/findings.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'vrx-findings-main',
  imports: [CommonModule, PageContainerComponent, TableComponent, ButtonComponent, FormsModule],
  templateUrl: './findings-main.html',
  styleUrl: './findings-main.scss'
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
