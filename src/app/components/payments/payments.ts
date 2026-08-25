import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementService } from '../../services/procurement.service';
import { PaymentRecord } from '../../models/procurement.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header-title">
        <div>
          <h1><i class="fa-solid fa-indian-rupee-sign text-primary"></i> Direct Benefit Transfer (DBT) Payouts</h1>
          <p class="page-header-subtitle">PFMS Disbursal Monitoring, Bank Account Verification & Transaction Audits</p>
        </div>
        <span class="badge badge-purple">Phase 2 DBT Architecture</span>
      </div>

      <div class="agri-card mb-6">
        <div class="agri-card-header">
          <div class="agri-card-title">
            <i class="fa-solid fa-building-columns text-primary"></i>
            PFMS Batch Disbursements Overview (Simulated)
          </div>
          <span class="badge badge-optimal">Realtime Sync</span>
        </div>

        <div class="agri-table-container">
          <table class="agri-table">
            <thead>
              <tr>
                <th>DBT Ref No.</th>
                <th>Farmer Name</th>
                <th>Bank & Account</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Payout Date</th>
                <th>Disbursal Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pay of payments">
                <td><code>{{ pay.dbtRefNo }}</code></td>
                <td>
                  <strong>{{ pay.farmerName }}</strong>
                  <div class="text-xs text-muted">{{ pay.farmerRegNo }}</div>
                </td>
                <td>
                  {{ pay.bankName }}
                  <div class="text-xs text-muted">{{ pay.accountNoMasked }} • {{ pay.ifscCode }}</div>
                </td>
                <td><strong class="text-primary-700">₹ {{ pay.amount | number }}</strong></td>
                <td>
                  <span 
                    class="badge" 
                    [class.badge-optimal]="pay.status === 'DISBURSED'" 
                    [class.badge-blue]="pay.status === 'PROCESSING'" 
                    [class.badge-moderate]="pay.status === 'PFMS_APPROVED'"
                  >
                    {{ pay.status }}
                  </span>
                </td>
                <td>{{ pay.payoutDate }}</td>
                <td>
                  <button 
                    *ngIf="pay.status !== 'DISBURSED'" 
                    class="btn btn-primary btn-sm" 
                    (click)="approve(pay.id)"
                  >
                    Release Payout
                  </button>
                  <span *ngIf="pay.status === 'DISBURSED'" class="text-xs text-emerald font-bold">
                    <i class="fa-solid fa-check-circle"></i> Disbursed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phase 2 Banner -->
      <div class="phase2-banner">
        <i class="fa-solid fa-shield-halved phase2-icon"></i>
        <div>
          <h3>Production PFMS / DBT Gateway Integration</h3>
          <p>Real-time NPCI Aadhar-seeded bank account disbursal and PFMS treasury callbacks will be connected in Phase 2.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-6 { margin-bottom: 24px; }
    .text-xs { font-size: 0.75rem; }
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
    .phase2-icon {
      font-size: 2.2rem;
      color: var(--primary-700);
    }
  `]
})
export class PaymentsComponent implements OnInit {
  payments: PaymentRecord[] = [];

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getPayments().subscribe(data => this.payments = data);
  }

  approve(id: string) {
    this.procurementService.approvePayment(id);
  }
}
