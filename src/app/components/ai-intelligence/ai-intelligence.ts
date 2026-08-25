import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementService } from '../../services/procurement.service';
import { AIAlert } from '../../models/procurement.model';

@Component({
  selector: 'app-ai-intelligence',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header-title">
        <div>
          <h1><i class="fa-solid fa-brain text-primary"></i> AI Congestion Intelligence & Load Balancer</h1>
          <p class="page-header-subtitle">Predictive Queue Bottlenecks, Automated Rerouting & Weather Arrival Models</p>
        </div>
        <span class="badge badge-purple">ML Simulation Active</span>
      </div>

      <div class="agri-card mb-6">
        <div class="agri-card-header">
          <div class="agri-card-title">
            <i class="fa-solid fa-robot text-primary"></i> Active AI Congestion Recommendations
          </div>
          <span class="badge badge-critical">{{ alerts.length }} Active Advisories</span>
        </div>

        <div class="alert-list">
          <div *ngFor="let alert of alerts" class="alert-box">
            <div class="alert-header">
              <span 
                class="badge" 
                [class.badge-critical]="alert.severity === 'CRITICAL'" 
                [class.badge-congested]="alert.severity === 'WARNING'" 
                [class.badge-blue]="alert.severity === 'INFO'"
              >
                {{ alert.severity }}
              </span>
              <span class="text-xs text-muted">{{ alert.timestamp }}</span>
            </div>
            <h3>{{ alert.title }}</h3>
            <p>{{ alert.message }}</p>
            <div *ngIf="alert.recommendedAction" class="rec-section">
              <strong>Action Strategy:</strong> {{ alert.recommendedAction }}
              <div class="mt-3">
                <button *ngIf="!alert.executed" class="btn btn-accent btn-sm" (click)="execute(alert.id)">
                  <i class="fa-solid fa-route"></i> Execute Reroute & Send SMS Notifications
                </button>
                <span *ngIf="alert.executed" class="text-emerald font-bold text-sm">
                  <i class="fa-solid fa-check-circle"></i> Reroute Order Dispatched to Scheduled Farmers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phase 2 ML Model Notice -->
      <div class="phase2-banner">
        <i class="fa-solid fa-microchip phase2-icon"></i>
        <div>
          <h3>Phase 2 Deep Learning Traffic Model</h3>
          <p>Real-time Python PyTorch/TensorFlow Mandi arrival models utilizing ISRO satellite weather data will be integrated in Phase 2.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-list { display: flex; flex-direction: column; gap: 16px; }
    .alert-box { background: #ffffff; border: 1px solid var(--border-light); border-radius: 12px; padding: 20px; }
    .alert-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .rec-section { background: #f8faf9; border-left: 4px solid var(--primary-600); padding: 12px; border-radius: 6px; margin-top: 12px; font-size: 0.875rem; }
    .mb-6 { margin-bottom: 24px; }
    .mt-3 { margin-top: 12px; }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.85rem; }
    .font-bold { font-weight: 700; }
    .phase2-banner {
      background: #ffffff;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: var(--shadow-sm);
    }
    .phase2-icon { font-size: 2.2rem; color: var(--primary-700); }
  `]
})
export class AiIntelligenceComponent implements OnInit {
  alerts: AIAlert[] = [];

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getAIAlerts().subscribe(data => this.alerts = data);
  }

  execute(id: string) {
    this.procurementService.executeRerouteAction(id);
  }
}
