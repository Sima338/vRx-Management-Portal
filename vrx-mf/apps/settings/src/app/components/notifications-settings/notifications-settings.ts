import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vrx-notifications-settings',
  imports: [CommonModule],
  templateUrl: './notifications-settings.html',
  styles: [`
    .settings-section {
      padding: 24px;
    }

    h3 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }

    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .settings-form {
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .notification-group {
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      padding: 16px;
      background: #f8f9fa;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .form-input {
      padding: 12px;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #007aff;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: normal;
      cursor: pointer;
      font-size: 14px;
      position: relative;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      appearance: none;
      background: white;
      border: 2px solid #e5e5e7;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .checkbox-label input[type="checkbox"]:checked {
      background: #007aff;
      border-color: #007aff;
    }

    .checkbox-label input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 4px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-label input[type="checkbox"]:hover {
      border-color: #007aff;
    }

    .checkbox-label input[type="checkbox"]:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
    }
  `]
})
export class NotificationsSettingsComponent {}
