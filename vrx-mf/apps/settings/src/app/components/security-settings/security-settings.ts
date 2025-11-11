import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vrx-security-settings',
  imports: [CommonModule],
  templateUrl: './security-settings.html',
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

    .settings-form {
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label, .form-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .form-input, .form-select {
      padding: 12px;
      border: 1px solid #e5e5e7;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }

    .form-select {
      padding-left: 16px;
      padding-right: 40px;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 16px 16px;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #007aff;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
export class SecuritySettingsComponent {}
