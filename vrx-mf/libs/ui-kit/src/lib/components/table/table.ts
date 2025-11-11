import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'badge' | 'avatar' | 'date' | 'actions';
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  class?: string;
}

@Component({
  selector: 'vrx-table',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <!-- Search Bar -->
      <div class="search-bar" *ngIf="showSearch">
        <input 
          type="text" 
          class="search-input" 
          [placeholder]="searchPlaceholder"
          [(ngModel)]="searchTerm"
          (input)="onSearch()">
        <span class="search-icon">🔍</span>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let column of columns" [style.width]="column.width">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of filteredData; let i = index" class="table-row" [attr.data-index]="i">
            <td *ngFor="let column of columns" [ngClass]="'cell-' + column.type">
              
              <!-- Text Cell -->
              <span *ngIf="column.type === 'text' || !column.type">
                {{ getNestedValue(item, column.key) }}
              </span>
              
              <!-- Avatar Cell -->
              <div *ngIf="column.type === 'avatar'" class="avatar-cell">
                <div class="avatar">{{ getAvatarInitial(item, column.key) }}</div>
                <span>{{ getNestedValue(item, column.key) }}</span>
              </div>
              
              <!-- Badge Cell -->
              <span *ngIf="column.type === 'badge'" 
                    class="badge" 
                    [ngClass]="getBadgeClass(item, column.key)">
                {{ getNestedValue(item, column.key) }}
              </span>
              
              <!-- Date Cell -->
              <span *ngIf="column.type === 'date'" class="date-cell">
                {{ formatDate(item, column.key) }}
              </span>
              
              <!-- Actions Cell -->
              <div *ngIf="column.type === 'actions'" class="actions-cell">
                <button *ngFor="let action of actions" 
                        class="action-btn"
                        [ngClass]="action.class"
                        [title]="action.label"
                        (click)="onAction(action.action, item, i)">
                  {{ action.icon }}
                </button>
              </div>
              
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="no-data">
              {{ emptyMessage || 'No data available' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e7;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f8f9fa;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e5e5e7;
      font-size: 14px;
    }

    .data-table td {
      padding: 16px;
      border-bottom: 1px solid #f5f5f7;
      vertical-align: middle;
      font-size: 14px;
    }

    .table-row:hover {
      background: #f8f9fa;
    }

    /* Avatar Cell */
    .avatar-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    .avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    /* Badge Cell */
    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-admin {
      background: #ffe2e5;
      color: #c53030;
    }

    .badge-editor {
      background: #fff3cd;
      color: #b45309;
    }

    .badge-viewer {
      background: #d1ecf1;
      color: #0c5460;
    }

    /* Severity Badges */
    .badge-critical {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-high {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-medium {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-low {
      background: #dcfce7;
      color: #16a34a;
    }

    /* Status Badges */
    .badge-open {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-investigating {
      background: #dbeafe;
      color: #2563eb;
    }

    .badge-resolved {
      background: #dcfce7;
      color: #16a34a;
    }

    .badge-false_positive {
      background: #f3f4f6;
      color: #6b7280;
    }

    /* Active/Inactive Status Badges */
    .badge-active {
      background: #dcfce7;
      color: #16a34a;
    }

    .badge-inactive {
      background: #fee2e2;
      color: #dc2626;
    }

    /* Date Cell */
    .date-cell {
      color: #666;
      font-size: 13px;
    }

    /* Actions Cell */
    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 6px 8px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    .action-edit {
      background: #f0f9ff;
    }

    .action-edit:hover {
      background: #e0f2fe;
    }

    .action-delete {
      background: #fef2f2;
    }

    .action-delete:hover {
      background: #fee2e2;
    }

    .action-view {
      background: #f0fdf4;
    }

    .action-view:hover {
      background: #dcfce7;
    }

    /* Empty State */
    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
    }

    /* Cell Types */
    .cell-text {
      color: #333;
    }

    .cell-date .date-cell {
      color: #666;
    }

    /* Search Bar */
    .search-bar {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border-radius: 8px;
      font-size: 14px;
      background: white;
      border: none;
    }

    .search-input:focus {
      outline: none;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      pointer-events: none;
    }
  `],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: unknown[] = [];
  @Input() actions: TableAction[] = [];
  @Input() emptyMessage = '';
  @Input() showSearch = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() searchColumns: string[] = [];
  @Output() actionClicked = new EventEmitter<{action: string, item: unknown, index: number}>();

  searchTerm = '';
  filteredData: unknown[] = [];

  ngOnInit() {
    this.filteredData = [...this.data];
  }

  ngOnChanges() {
    this.filteredData = [...this.data];
    if (this.searchTerm) {
      this.performSearch();
    }
  }

  onSearch() {
    this.performSearch();
  }

  private performSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    const columnsToSearch = this.searchColumns.length > 0 
      ? this.searchColumns 
      : this.columns.filter(col => col.type !== 'actions' && col.type !== 'avatar').map(col => col.key);

    this.filteredData = this.data.filter(item => {
      return columnsToSearch.some(columnKey => {
        const value = this.getNestedValue(item, columnKey);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }

  getNestedValue(item: unknown, key: string): unknown {
    return key.split('.').reduce((obj: any, prop) => obj?.[prop], item) || '';
  }

  getAvatarInitial(item: unknown, key: string): string {
    const value = this.getNestedValue(item, key);
    return value ? value.toString().charAt(0).toUpperCase() : '?';
  }

  getBadgeClass(item: unknown, key: string): string {
    const value = this.getNestedValue(item, key);
    return 'badge-' + value?.toString().toLowerCase();
  }

  formatDate(item: unknown, key: string): string {
    const value = this.getNestedValue(item, key);
    if (value === 'Never') return 'Never';
    
    const date = new Date(value as string);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  }

  onAction(action: string, item: unknown, index: number) {
    this.actionClicked.emit({ action, item, index });
  }
}
