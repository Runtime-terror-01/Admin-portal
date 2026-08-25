import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../services/procurement.service';
import { AuditLog } from '../../models/procurement.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Header -->
      <div class="page-header-title">
        <div>
          <h1>
            <i class="fa-solid fa-clipboard-list text-primary"></i>
            Government Master Audit Logs
          </h1>
          <p class="page-header-subtitle">
            Immutable Administrative Action Log, Master Overrides, Mandi Reassignments & Configuration Audit Trail
          </p>
        </div>
        <div class="header-actions">
          <span class="badge badge-purple">
            <i class="fa-solid fa-shield-halved"></i> Master Audit Enabled
          </span>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder="Search action, admin ID, entity, or details..." 
            [(ngModel)]="searchQuery"
          />
        </div>

        <div class="filter-group">
          <label><i class="fa-solid fa-filter"></i> Category:</label>
          <select [(ngModel)]="selectedCategory">
            <option value="ALL">All Categories</option>
            <option value="FARMER">Farmer</option>
            <option value="CENTRE">Centre</option>
            <option value="QUEUE">Queue</option>
            <option value="PAYMENT">Payment</option>
            <option value="AI_REROUTE">AI Reroute</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="agri-card">
        <div class="agri-card-header">
          <div class="agri-card-title">
            <i class="fa-solid fa-list-check text-primary"></i>
            Master Operations Log Entries ({{ filteredLogs.length }})
          </div>
          <span class="text-xs text-muted">Sorted chronologically (Newest first)</span>
        </div>

        <div class="agri-table-container">
          <table class="agri-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin Officer</th>
                <th>Category</th>
                <th>Action</th>
                <th>Target Entity</th>
                <th>Previous → New Value</th>
                <th>Audit Details</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of filteredLogs">
                <td>
                  <i class="fa-regular fa-clock text-muted"></i>
                  <span class="font-semibold text-xs ml-1">{{ log.timestamp }}</span>
                </td>
                <td>
                  <div class="font-bold text-main">{{ log.adminName }}</div>
                  <code class="admin-id">{{ log.adminId }}</code>
                </td>
                <td>
                  <span 
                    class="badge"
                    [class.badge-blue]="log.category === 'FARMER'"
                    [class.badge-optimal]="log.category === 'CENTRE'"
                    [class.badge-moderate]="log.category === 'QUEUE'"
                    [class.badge-purple]="log.category === 'PAYMENT'"
                    [class.badge-critical]="log.category === 'AI_REROUTE'"
                  >
                    {{ log.category }}
                  </span>
                </td>
                <td><strong class="text-primary-700">{{ log.action }}</strong></td>
                <td><span class="entity-pill">{{ log.entityName }}</span></td>
                <td>
                  <div *ngIf="log.previousValue || log.newValue" class="change-diff">
                    <span class="prev-val" *ngIf="log.previousValue">{{ log.previousValue }}</span>
                    <i class="fa-solid fa-arrow-right diff-arrow" *ngIf="log.previousValue && log.newValue"></i>
                    <span class="new-val" *ngIf="log.newValue">{{ log.newValue }}</span>
                  </div>
                  <span *ngIf="!log.previousValue && !log.newValue" class="text-xs text-muted">N/A</span>
                </td>
                <td><p class="log-details">{{ log.details }}</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      background: #ffffff;
      padding: 16px 20px;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
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

    .admin-id {
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.725rem;
      color: #475569;
    }

    .entity-pill {
      background: var(--primary-50);
      color: var(--primary-700);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.775rem;
      font-weight: 700;
    }

    .change-diff {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.775rem;
    }

    .prev-val {
      color: #ef4444;
      background: #fee2e2;
      padding: 2px 6px;
      border-radius: 4px;
      text-decoration: line-through;
    }

    .diff-arrow {
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .new-val {
      color: #059669;
      background: #d1fae5;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    .log-details {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .text-xs { font-size: 0.75rem; }
    .font-semibold { font-weight: 600; }
    .ml-1 { margin-left: 4px; }
  `]
})
export class AuditComponent implements OnInit {
  logs: AuditLog[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'ALL';

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getAuditLogs().subscribe(data => this.logs = data);
  }

  get filteredLogs(): AuditLog[] {
    return this.logs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            log.adminId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            log.entityName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            log.details.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'ALL' || log.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
