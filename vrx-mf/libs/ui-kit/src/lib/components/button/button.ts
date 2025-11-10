import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'icon';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'vrx-button',
  imports: [CommonModule],
  template: `
    <button 
      [class]="getButtonClasses()"
      [disabled]="disabled"
      [type]="type"
      (click)="onClick()">
      <span *ngIf="icon" class="btn-icon">{{ icon }}</span>
      <ng-content></ng-content>
      <span *ngIf="loading" class="btn-loading">⏳</span>
    </button>
  `,
  styles: [`
    button {
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      text-decoration: none;
      font-family: inherit;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Variants */
    .btn-primary {
      background: #007aff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #e5e5e7;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e9ecef;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c82333;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
    }

    .btn-icon {
      background: transparent;
      border: none;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    /* Sizes */
    .btn-small {
      padding: 8px 16px;
      font-size: 12px;
    }

    .btn-medium {
      padding: 12px 20px;
      font-size: 14px;
    }

    .btn-large {
      padding: 16px 24px;
      font-size: 16px;
    }

    .btn-icon-size {
      padding: 6px 8px;
      font-size: 12px;
    }

    /* Icon */
    .btn-icon {
      font-size: 16px;
      font-weight: bold;
    }

    .btn-loading {
      font-size: 12px;
    }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<void>();

  getButtonClasses(): string {
    const classes = ['btn-' + this.variant];
    
    if (this.variant === 'icon') {
      classes.push('btn-icon-size');
    } else {
      classes.push('btn-' + this.size);
    }
    
    return classes.join(' ');
  }

  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}