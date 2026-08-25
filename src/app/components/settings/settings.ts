import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header-title">
        <div>
          <h1><i class="fa-solid fa-sliders text-primary"></i> System Settings & API Configuration</h1>
          <p class="page-header-subtitle">Mandi Operational Hours, MSP Rate Schedule & Spring Boot Backend API Connection</p>
        </div>
        <span class="badge badge-purple">Phase 2 Scheduled</span>
      </div>

      <!-- Backend Connection Settings Card -->
      <div class="agri-card mb-6">
        <div class="agri-card-header">
          <div class="agri-card-title"><i class="fa-solid fa-plug text-primary"></i> Backend API Connection Settings</div>
          <span class="badge badge-optimal">Mock Active</span>
        </div>
        <div class="setting-row">
          <div>
            <strong>Operational Mode:</strong> Phase 1.1 Demo Mode (Local RxJS Mock & Auth Services)
            <p class="text-xs text-muted">Currently serving simulated Indian agricultural procurement data in browser memory.</p>
          </div>
          <button class="btn btn-secondary btn-sm" disabled>Mock Active</button>
        </div>
        <div class="setting-row border-top">
          <div>
            <strong>Spring Boot REST Endpoint:</strong>
            <code>http://localhost:8080/api/v1/procurement</code>
            <p class="text-xs text-muted">Architecture structured for seamless transition to Spring Boot backend APIs.</p>
          </div>
          <button class="btn btn-primary btn-sm">Test Endpoint Connection</button>
        </div>
      </div>

      <!-- Demo Notification Simulator Card -->
      <div class="agri-card mb-6">
        <div class="agri-card-header">
          <div class="agri-card-title"><i class="fa-solid fa-bell text-primary"></i> Notification Simulator Utility</div>
          <span class="badge badge-blue">SIH Demo Tool</span>
        </div>
        <div class="setting-row">
          <div>
            <strong>Simulate Live Mandi Congestion Alert:</strong>
            <p class="text-xs text-muted">Triggers a real-time notification in the Government Notification Center to test live bell updates (🔔).</p>
          </div>
          <button class="btn btn-accent btn-sm" (click)="triggerDemoAlert()">
            <i class="fa-solid fa-bolt"></i> Generate Live Demo Alert
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .mb-6 { margin-bottom: 24px; }
    .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; gap: 16px; }
    .border-top { border-top: 1px solid var(--border-light); }
    .text-xs { font-size: 0.75rem; }
  `]
})
export class SettingsComponent {
  constructor(private notificationService: NotificationService) {}

  triggerDemoAlert() {
    this.notificationService.simulateDemoAlert();
  }
}
