import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header-title">
        <div>
          <h1><i class="fa-solid fa-file-invoice text-primary"></i> Reports & Analytics</h1>
          <p class="page-header-subtitle">Daily Mandi Arrivals, Crop-wise Procurement Summaries & District Analytics</p>
        </div>
        <button class="btn btn-primary" (click)="exportReport()">
          <i class="fa-solid fa-download"></i> Export PDF Summary
        </button>
      </div>

      <div class="agri-card placeholder-card">
        <div class="placeholder-icon"><i class="fa-solid fa-chart-pie"></i></div>
        <h3>Mandi Procurement Analytics Engine</h3>
        <p>Comprehensive report generation for District Procurement Officers, State Food Supplies, and FCI Auditors.</p>
        <div class="demo-tag mt-3">
          <i class="fa-solid fa-file-csv"></i> EXPORT READY • SIMULATED REPORTS
        </div>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-card { text-align: center; padding: 60px 40px; margin-top: 20px; }
    .placeholder-icon { font-size: 3.5rem; color: var(--primary-700); margin-bottom: 16px; }
    .demo-tag { display: inline-block; background: #f1f5f9; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; color: #475569; font-weight: 700; }
  `]
})
export class ReportsComponent {
  exportReport() {
    window.print();
  }
}
