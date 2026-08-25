import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../services/procurement.service';
import { QueueToken, QueueStatus } from '../../models/procurement.model';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore.pipe';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, ReplaceUnderscorePipe],
  template: `
    <div class="page-wrapper">
      <!-- Header -->
      <div class="page-header-title">
        <div>
          <h1>
            <i class="fa-solid fa-list-check text-primary"></i>
            Live Queue & Token Operations Monitor
          </h1>
          <p class="page-header-subtitle">
            Token Dispatch, Gate Entry Check-in, Moisture Testing & Weighbridge Gate Simulation
          </p>
        </div>
        <div class="header-actions">
          <div class="demo-tag">
            <i class="fa-solid fa-circle-dot text-emerald"></i> LIVE QUEUE CONTROLLER ACTIVE
          </div>
        </div>
      </div>

      <!-- Queue Action Controls Panel -->
      <div class="sim-control-panel">
        <div class="sim-info">
          <h3><i class="fa-solid fa-sliders text-gold"></i> Live Mandi Queue Control Operations</h3>
          <p>Execute real-time gate entry check-ins, advance token processing, or issue fast-track passes.</p>
        </div>

        <div class="sim-buttons">
          <button class="btn btn-primary" (click)="callNextToken()">
            <i class="fa-solid fa-forward-step"></i> Call Next Token into Processing
          </button>
          <button class="btn btn-accent" (click)="issuePriorityPass()">
            <i class="fa-solid fa-star"></i> Fast-Track Priority Token Pass
          </button>
        </div>
      </div>

      <!-- View Selector Tabs -->
      <div class="tabs-header">
        <button class="tab-btn" [class.active]="activeTab === 'TABLE'" (click)="activeTab = 'TABLE'">
          <i class="fa-solid fa-table"></i> Live Queue Monitor Directory
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'PIPELINE'" (click)="activeTab = 'PIPELINE'">
          <i class="fa-solid fa-diagram-project"></i> Mandi Gate Stage Pipeline
        </button>
      </div>

      <!-- TAB 1: Live Queue Directory Table View -->
      <div class="agri-card" *ngIf="activeTab === 'TABLE'">
        <!-- Table Search & Filter Bar -->
        <div class="table-filter-bar mb-4">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              placeholder="Search Token, Farmer, Mandi, Crop..." 
              [(ngModel)]="searchQuery"
            />
          </div>

          <div class="filter-group">
            <label>Status Filter:</label>
            <select [(ngModel)]="statusFilter">
              <option value="ALL">All Statuses</option>
              <option value="WAITING">Waiting</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="SKIPPED">Skipped</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="agri-table-container">
          <table class="agri-table">
            <thead>
              <tr>
                <th>Token No.</th>
                <th>Farmer Info</th>
                <th>Mandi Centre</th>
                <th>Crop & Quantity</th>
                <th>Arrival Time</th>
                <th>Status</th>
                <th>Est. Waiting</th>
                <th>Queue Operations Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let token of filteredTokens">
                <td>
                  <span class="token-num">{{ token.tokenNo }}</span>
                  <span *ngIf="token.isPriority" class="badge badge-critical mt-1">Priority Pass</span>
                </td>
                <td>
                  <strong class="farmer-name">{{ token.farmerName }}</strong>
                  <div class="text-xs text-muted">Reg: {{ token.farmerRegNo }}</div>
                </td>
                <td>
                  <div class="font-semibold text-primary-700">{{ token.centreName }}</div>
                  <div class="text-xs text-muted">{{ token.gateNo }}</div>
                </td>
                <td>
                  <span class="crop-tag">{{ token.cropType }}</span>
                  <div class="text-xs text-muted mt-1">{{ token.quantityQuintals }} Quintals</div>
                </td>
                <td><i class="fa-regular fa-clock text-muted"></i> {{ token.arrivalTime }}</td>
                <td>
                  <span 
                    class="badge"
                    [class.badge-optimal]="token.status === 'COMPLETED'"
                    [class.badge-blue]="token.status === 'CHECKED_IN' || token.status === 'PROCESSING'"
                    [class.badge-moderate]="token.status === 'WAITING'"
                    [class.badge-congested]="token.status === 'SKIPPED'"
                    [class.badge-critical]="token.status === 'CANCELLED'"
                  >
                    {{ token.status | replaceUnderscore }}
                  </span>
                </td>
                <td>{{ token.estimatedWaitingTimeMinutes }} mins</td>
                <td>
                  <div class="action-btn-group">
                    <button 
                      *ngIf="token.status === 'WAITING'"
                      class="btn btn-secondary btn-sm"
                      (click)="changeStatus(token.id, 'CHECKED_IN')"
                    >
                      <i class="fa-solid fa-user-check"></i> Check In
                    </button>

                    <button 
                      *ngIf="token.status === 'CHECKED_IN'"
                      class="btn btn-primary btn-sm"
                      (click)="changeStatus(token.id, 'PROCESSING')"
                    >
                      <i class="fa-solid fa-gears"></i> Process
                    </button>

                    <button 
                      *ngIf="token.status === 'PROCESSING'"
                      class="btn btn-primary btn-sm"
                      (click)="changeStatus(token.id, 'COMPLETED')"
                    >
                      <i class="fa-solid fa-check"></i> Complete
                    </button>

                    <button 
                      *ngIf="token.status !== 'COMPLETED' && token.status !== 'CANCELLED' && token.status !== 'SKIPPED'"
                      class="btn btn-secondary btn-sm"
                      (click)="changeStatus(token.id, 'SKIPPED')"
                      title="Skip Token"
                    >
                      Skip
                    </button>

                    <button 
                      *ngIf="token.status !== 'COMPLETED' && token.status !== 'CANCELLED'"
                      class="btn btn-danger btn-sm"
                      (click)="changeStatus(token.id, 'CANCELLED')"
                      title="Cancel Token"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: Stage Pipeline View -->
      <div class="stage-columns-grid" *ngIf="activeTab === 'PIPELINE'">
        <!-- Gate Check-in -->
        <div class="stage-col">
          <div class="stage-header bg-slate">
            <span><i class="fa-solid fa-door-open"></i> Gate Check-in</span>
            <span class="stage-count">{{ getItemsByStage('GATE_CHECKIN').length }}</span>
          </div>

          <div class="stage-body">
            <div *ngFor="let item of getItemsByStage('GATE_CHECKIN')" class="token-card">
              <div class="token-card-head">
                <span class="token-num">{{ item.tokenNo }}</span>
                <span *ngIf="item.isPriority" class="badge badge-critical">Priority</span>
              </div>
              <h4 class="token-farmer">{{ item.farmerName }}</h4>
              <p class="token-sub">{{ item.cropType }} • {{ item.centreName }}</p>
              <div class="token-footer mt-3">
                <span class="text-xs text-muted"><i class="fa-regular fa-clock"></i> {{ item.arrivalTime }}</span>
                <button class="btn btn-secondary btn-sm" (click)="advanceStage(item.id, 'MOISTURE_TEST')">
                  Moisture <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Moisture Test -->
        <div class="stage-col">
          <div class="stage-header bg-amber">
            <span><i class="fa-solid fa-droplet"></i> Moisture Testing</span>
            <span class="stage-count">{{ getItemsByStage('MOISTURE_TEST').length }}</span>
          </div>

          <div class="stage-body">
            <div *ngFor="let item of getItemsByStage('MOISTURE_TEST')" class="token-card border-amber">
              <div class="token-card-head">
                <span class="token-num text-amber">{{ item.tokenNo }}</span>
                <span class="badge badge-moderate">Est: {{ item.estimatedWaitingTimeMinutes }}m</span>
              </div>
              <h4 class="token-farmer">{{ item.farmerName }}</h4>
              <p class="token-sub">{{ item.cropType }} • Gate Sensor OK</p>
              <div class="token-footer mt-3">
                <span class="text-xs text-muted">Moisture Range OK</span>
                <button class="btn btn-secondary btn-sm" (click)="advanceStage(item.id, 'WEIGHBRIDGE')">
                  Weighbridge <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Weighbridge Gate -->
        <div class="stage-col">
          <div class="stage-header bg-blue">
            <span><i class="fa-solid fa-truck-ramp-box"></i> Weighbridge Tonnage</span>
            <span class="stage-count">{{ getItemsByStage('WEIGHBRIDGE').length }}</span>
          </div>

          <div class="stage-body">
            <div *ngFor="let item of getItemsByStage('WEIGHBRIDGE')" class="token-card border-blue">
              <div class="token-card-head">
                <span class="token-num text-blue">{{ item.tokenNo }}</span>
                <span class="badge badge-blue">Scale #1</span>
              </div>
              <h4 class="token-farmer">{{ item.farmerName }}</h4>
              <p class="token-sub">{{ item.cropType }} • {{ item.quantityQuintals }} Qtl</p>
              <div class="token-footer mt-3">
                <span class="text-xs text-muted">Weight Capture</span>
                <button class="btn btn-secondary btn-sm" (click)="advanceStage(item.id, 'QUALITY_APPROVAL')">
                  Quality Check <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quality Approval & Completion -->
        <div class="stage-col">
          <div class="stage-header bg-emerald">
            <span><i class="fa-solid fa-circle-check"></i> Quality Approval & Payout</span>
            <span class="stage-count">{{ getItemsByStage('QUALITY_APPROVAL').length }}</span>
          </div>

          <div class="stage-body">
            <div *ngFor="let item of getItemsByStage('QUALITY_APPROVAL')" class="token-card border-emerald">
              <div class="token-card-head">
                <span class="token-num text-emerald">{{ item.tokenNo }}</span>
                <span class="badge badge-optimal">Grade Approved</span>
              </div>
              <h4 class="token-farmer">{{ item.farmerName }}</h4>
              <p class="token-sub">{{ item.cropType }} • Grade A</p>
              <div class="token-footer mt-3">
                <span class="text-xs text-emerald font-bold">Ready for Payout</span>
                <button class="btn btn-primary btn-sm" (click)="changeStatus(item.id, 'COMPLETED')">
                  Complete <i class="fa-solid fa-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .demo-tag {
      background: #d1fae5;
      border: 1px solid #10b981;
      color: #047857;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 6px 12px;
      border-radius: 8px;
    }

    .sim-control-panel {
      background: #ffffff;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
      gap: 16px;
    }

    .sim-info h3 {
      font-size: 1.05rem;
      color: var(--slate-900);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sim-info p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .sim-buttons {
      display: flex;
      gap: 12px;
    }

    .tabs-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .tab-btn {
      background: #ffffff;
      border: 1px solid var(--border-light);
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--primary-700);
      color: #ffffff;
      border-color: var(--primary-700);
    }

    .table-filter-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8faf9;
      border: 1px solid var(--border-light);
      padding: 8px 14px;
      border-radius: 8px;
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 0.875rem;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .filter-group select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-light);
      outline: none;
      background: #ffffff;
      font-size: 0.85rem;
    }

    .token-num {
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--primary-700);
    }

    .farmer-name {
      font-size: 0.9rem;
      color: var(--slate-900);
    }

    .crop-tag {
      background: var(--primary-50);
      color: var(--primary-700);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .action-btn-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* Stage Pipeline Styles */
    .stage-columns-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    @media (max-width: 1200px) {
      .stage-columns-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .stage-columns-grid { grid-template-columns: 1fr; }
    }

    .stage-col {
      background: #f8faf9;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 480px;
    }

    .stage-header {
      padding: 12px 16px;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bg-slate { background: #1B2A32; }
    .bg-amber { background: #D97706; }
    .bg-blue { background: #2563EB; }
    .bg-emerald { background: #059669; }

    .stage-count {
      background: rgba(255, 255, 255, 0.25);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
    }

    .stage-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    .token-card {
      background: #ffffff;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 14px;
      box-shadow: var(--shadow-sm);
    }

    .border-amber { border-left: 4px solid #D97706; }
    .border-blue { border-left: 4px solid #2563EB; }
    .border-emerald { border-left: 4px solid #059669; }

    .token-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .token-farmer {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .token-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .token-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #f1f5f9;
      padding-top: 10px;
    }

    .mt-3 { margin-top: 12px; }
    .mt-1 { margin-top: 4px; }
    .mb-4 { margin-bottom: 16px; }
    .text-xs { font-size: 0.75rem; }
    .text-amber { color: #D97706; }
    .text-blue { color: #2563EB; }
    .text-emerald { color: #059669; }
    .font-bold { font-weight: 700; }
  `]
})
export class QueueComponent implements OnInit {
  activeTab: 'TABLE' | 'PIPELINE' = 'TABLE';
  queueList: QueueToken[] = [];
  searchQuery: string = '';
  statusFilter: string = 'ALL';

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getQueue().subscribe(data => this.queueList = data);
  }

  get filteredTokens(): QueueToken[] {
    return this.queueList.filter(token => {
      const matchesSearch = token.tokenNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            token.farmerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            token.centreName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            token.cropType.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || token.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getItemsByStage(stage: QueueToken['stage']): QueueToken[] {
    return this.queueList.filter(q => q.stage === stage && q.status !== 'COMPLETED' && q.status !== 'CANCELLED');
  }

  changeStatus(tokenId: string, newStatus: QueueStatus) {
    this.procurementService.updateQueueTokenStatus(tokenId, newStatus);
  }

  advanceStage(tokenId: string, nextStage: QueueToken['stage']) {
    this.procurementService.updateQueueTokenStatus(tokenId, 'PROCESSING', nextStage);
  }

  callNextToken() {
    this.procurementService.callNextToken();
  }

  issuePriorityPass() {
    this.procurementService.addPriorityPass();
  }
}
