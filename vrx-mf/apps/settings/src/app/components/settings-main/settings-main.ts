import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageContainerComponent } from '@vrx-mf/ui-kit';

@Component({
  selector: 'vrx-settings-main',
  imports: [CommonModule, PageContainerComponent, RouterModule],
  templateUrl: './settings-main.html',
  styleUrl: './settings-main.scss'
})
export class SettingsMainComponent {}
