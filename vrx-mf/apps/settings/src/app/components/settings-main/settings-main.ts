import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-settings-main',
  imports: [CommonModule, PageContainerComponent, RouterModule],
  template: `
    <vrx-page-container title="Settings" subtitle="Configure your application preferences">
      <div class="settings-layout">
        <!-- Settings Navigation -->
        <nav class="settings-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="general" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">⚙️</span>
                General
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="security" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">🔒</span>
                Security
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="notifications" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">🔔</span>
                Notifications
              </a>
            </li>
          </ul>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </vrx-page-container>
  `,
  styles: [`
    .settings-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 500px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .settings-nav {
      background: #f8f9fa;
      border-right: 1px solid #e5e5e7;
      padding: 0;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      border-bottom: 1px solid #e5e5e7;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      text-decoration: none;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      background: #e9ecef;
      color: #333;
    }

    .nav-link.active {
      background: #007aff;
      color: white;
      border-right: 3px solid #0056b3;
    }

    .nav-icon {
      font-size: 16px;
    }

    .settings-content {
      background: white;
      overflow-y: auto;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .settings-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .settings-nav {
        border-right: none;
        border-bottom: 1px solid #e5e5e7;
      }

      .nav-list {
        display: flex;
        overflow-x: auto;
      }

      .nav-item {
        border-bottom: none;
        border-right: 1px solid #e5e5e7;
        flex-shrink: 0;
      }

      .nav-link {
        padding: 12px 16px;
        white-space: nowrap;
      }
    }
  `],
})
export class SettingsMainComponent {}
