import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header-title">
        <div>
          <h1><i class="fa-solid fa-truck-ramp-box text-primary"></i> Procurement Tracking & Quality Grading</h1>
          <p class="page-header-subtitle">Moisture Content Testing, Weighbridge Tonnage Records & Grade Approval</p>
        </div>
        <span class="badge badge-purple">Coming in Phase 2</span>
      </div>

      <div class="agri-card placeholder-card">
        <div class="placeholder-icon"><i class="fa-solid fa-scale-balanced"></i></div>
        <h3>Mandi Procurement & Quality Testing Module</h3>
        <p>This module will handle automated weighbridge digital scale readings, IoT grain moisture sensors, and MSP price calculation engine.</p>
        <div class="demo-tag mt-3">
          <i class="fa-solid fa-code"></i> SPRING BOOT REST API READY ARCHITECTURE
        </div>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-card {
      text-align: center;
      padding: 60px 40px;
      margin-top: 20px;
    }
    .placeholder-icon {
      font-size: 3.5rem;
      color: var(--primary-700);
      margin-bottom: 16px;
    }
    .demo-tag {
      display: inline-block;
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #475569;
      font-weight: 700;
    }
  `]
})
export class ProcurementComponent {}
