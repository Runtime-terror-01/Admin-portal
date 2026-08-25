import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../services/procurement.service';
import { ProcurementCentre } from '../../models/procurement.model';

@Component({
  selector: 'app-centres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <!-- Header -->
      <div class="page-header-title">
        <div>
          <h1>
            <i class="fa-solid fa-building-wheat text-primary"></i>
            Procurement Centres Management (Mandis)
          </h1>
          <p class="page-header-subtitle">
            Real-time Capacity Utilization, Live Queue Monitoring, Gate Rate Calibration & Congestion Rerouting
          </p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="openAddCentreModal()">
            <i class="fa-solid fa-plus"></i> Add New Mandi Centre
          </button>
        </div>
      </div>

      <!-- Filters & Search Control Bar -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder="Search Centre ID, Mandi Name, District, or Officer..." 
            [(ngModel)]="searchQuery"
          />
        </div>

        <div class="filter-group">
          <label><i class="fa-solid fa-location-dot"></i> District:</label>
          <select [(ngModel)]="selectedDistrict">
            <option value="ALL">All Districts</option>
            <option value="Karnal">Karnal</option>
            <option value="Panipat">Panipat</option>
            <option value="Kurukshetra">Kurukshetra</option>
            <option value="Ambala">Ambala</option>
            <option value="Sonipat">Sonipat</option>
          </select>
        </div>

        <div class="filter-group">
          <label><i class="fa-solid fa-signal"></i> Status:</label>
          <select [(ngModel)]="selectedStatus">
            <option value="ALL">All Statuses</option>
            <option value="OPTIMAL">Optimal</option>
            <option value="MODERATE">Moderate</option>
            <option value="CONGESTED">Congested</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <!-- Mandi Cards & Hybrid Directory Grid -->
      <div class="centres-grid">
        <div *ngFor="let centre of filteredCentres" class="centre-card">
          <div class="card-head">
            <div>
              <span class="centre-id-badge">{{ centre.id }}</span>
              <h3 class="centre-name">{{ centre.name }}</h3>
              <span class="centre-sub"><i class="fa-solid fa-location-dot text-muted"></i> {{ centre.location }}</span>
            </div>
            <span 
              class="badge"
              [class.badge-optimal]="centre.status === 'OPTIMAL'"
              [class.badge-moderate]="centre.status === 'MODERATE'"
              [class.badge-congested]="centre.status === 'CONGESTED'"
              [class.badge-critical]="centre.status === 'CRITICAL'"
            >
              {{ centre.status }}
            </span>
          </div>

          <div class="metrics-grid">
            <div class="metric-box">
              <span class="metric-lbl">Live Queue</span>
              <span class="metric-val text-primary-900">{{ centre.currentQueue }} <small>/ {{ centre.maxCapacity }}</small></span>
            </div>
            <div class="metric-box">
              <span class="metric-lbl">Avg Processing</span>
              <span class="metric-val">{{ centre.avgProcessingTimeMinutes }} min</span>
            </div>
            <div class="metric-box">
              <span class="metric-lbl">Active Gates</span>
              <span class="metric-val">{{ centre.activeGates }} Gates</span>
            </div>
          </div>

          <!-- Capacity Utilization Progress Bar -->
          <div class="util-box">
            <div class="flex-between text-xs mb-1">
              <span>Capacity Utilization</span>
              <span class="font-bold">{{ centre.capacityUtilization }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div 
                class="progress-bar-fill"
                [style.width.%]="centre.capacityUtilization > 100 ? 100 : centre.capacityUtilization"
                [class.bg-emerald]="centre.status === 'OPTIMAL'"
                [class.bg-gold]="centre.status === 'MODERATE'"
                [class.bg-saffron]="centre.status === 'CONGESTED'"
                [class.bg-red]="centre.status === 'CRITICAL'"
              ></div>
            </div>
          </div>

          <div class="officer-info">
            <i class="fa-solid fa-user-shield text-muted"></i>
            <span>Officer: <strong>{{ centre.officerInCharge }}</strong> ({{ centre.contactMobile }})</span>
          </div>

          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" (click)="openDetailModal(centre)">
              <i class="fa-solid fa-eye"></i> Details
            </button>

            <button class="btn btn-secondary btn-sm" (click)="openEditModal(centre)">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>

            <button 
              *ngIf="centre.status === 'CONGESTED' || centre.status === 'CRITICAL'"
              class="btn btn-accent btn-sm"
              (click)="openRerouteModal(centre)"
            >
              <i class="fa-solid fa-route"></i> Reroute
            </button>
          </div>
        </div>
      </div>

      <!-- Detail View Modal -->
      <div class="modal-overlay" *ngIf="selectedCentreModal">
        <div class="modal-card">
          <div class="modal-header flex-between mb-4">
            <h2><i class="fa-solid fa-building-wheat text-primary"></i> {{ selectedCentreModal.name }}</h2>
            <button class="btn-close" (click)="selectedCentreModal = null">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid">
              <p><strong>Centre ID:</strong> <code>{{ selectedCentreModal.id }}</code></p>
              <p><strong>District & State:</strong> {{ selectedCentreModal.district }}, {{ selectedCentreModal.state }}</p>
              <p><strong>Location Yard:</strong> {{ selectedCentreModal.location }}</p>
              <p><strong>Officer In-Charge:</strong> {{ selectedCentreModal.officerInCharge }}</p>
              <p><strong>Contact Phone:</strong> {{ selectedCentreModal.contactMobile }}</p>
              <p><strong>Daily Gate Capacity:</strong> {{ selectedCentreModal.maxCapacity }} vehicles/day</p>
              <p><strong>Current Active Queue:</strong> {{ selectedCentreModal.currentQueue }} farmers waiting</p>
              <p><strong>Capacity Utilization:</strong> {{ selectedCentreModal.capacityUtilization }}%</p>
              <p><strong>Avg Processing Time:</strong> {{ selectedCentreModal.avgProcessingTimeMinutes }} mins/token</p>
              <p><strong>Predicted Congestion Level:</strong> {{ selectedCentreModal.predictedCongestion }}</p>
            </div>

            <div class="alert alert-info mt-4">
              <i class="fa-solid fa-circle-info"></i>
              Sensors operational. Real-time weighbridge scales synced with District Food Controller.
            </div>
          </div>
          <div class="modal-footer text-right mt-4">
            <button class="btn btn-secondary" (click)="selectedCentreModal = null">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Centre Modal -->
      <div class="modal-overlay" *ngIf="editCentreModal">
        <div class="modal-card">
          <div class="modal-header flex-between mb-4">
            <h2><i class="fa-solid fa-pen-to-square text-primary"></i> Edit Centre Settings</h2>
            <button class="btn-close" (click)="editCentreModal = null">&times;</button>
          </div>
          <form (ngSubmit)="saveCentreChanges()">
            <div class="form-grid">
              <div class="form-group">
                <label>Centre Name</label>
                <input type="text" [(ngModel)]="editFormData.name" name="name" required />
              </div>
              <div class="form-group">
                <label>Daily Max Capacity (Vehicles)</label>
                <input type="number" [(ngModel)]="editFormData.maxCapacity" name="maxCapacity" required />
              </div>
              <div class="form-group">
                <label>Active Weighbridge Gates</label>
                <input type="number" [(ngModel)]="editFormData.activeGates" name="activeGates" required />
              </div>
              <div class="form-group">
                <label>Avg Processing Time (Mins)</label>
                <input type="number" [(ngModel)]="editFormData.avgProcessingTimeMinutes" name="avgProcessingTimeMinutes" required />
              </div>
              <div class="form-group">
                <label>Officer In-Charge Name</label>
                <input type="text" [(ngModel)]="editFormData.officerInCharge" name="officerInCharge" required />
              </div>
              <div class="form-group">
                <label>Officer Mobile Contact</label>
                <input type="text" [(ngModel)]="editFormData.contactMobile" name="contactMobile" required />
              </div>
            </div>

            <div class="modal-footer flex-between mt-4">
              <button type="button" class="btn btn-secondary" (click)="editCentreModal = null">Cancel</button>
              <button type="submit" class="btn btn-primary">
                <i class="fa-solid fa-check"></i> Save Centre Updates
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Reroute Queue Modal -->
      <div class="modal-overlay" *ngIf="rerouteModalCentre">
        <div class="modal-card">
          <div class="modal-header flex-between mb-4">
            <h2><i class="fa-solid fa-route text-gold"></i> AI Reroute Traffic Recommendation</h2>
            <button class="btn-close" (click)="rerouteModalCentre = null">&times;</button>
          </div>
          <div class="modal-body">
            <p>High congestion alert at <strong>{{ rerouteModalCentre.name }}</strong> ({{ rerouteModalCentre.capacityUtilization }}% utilized).</p>
            <div class="rec-box mt-3 mb-3">
              <strong>Target Alternative: Kurukshetra Mandi Centre</strong>
              <p class="text-xs">Distance: 32km • Spare Capacity: 76% • Avg Processing: 22 mins</p>
            </div>
            <p class="text-sm">Executing will dispatch automated SMS token updates redirecting 25 scheduled farmers to Kurukshetra Mandi.</p>
          </div>
          <div class="modal-footer flex-between mt-4">
            <button class="btn btn-secondary" (click)="rerouteModalCentre = null">Cancel</button>
            <button class="btn btn-accent" (click)="confirmReroute()">
              <i class="fa-solid fa-paper-plane"></i> Execute Reroute Order
            </button>
          </div>
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

    .centres-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    @media (max-width: 1200px) {
      .centres-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .centres-grid { grid-template-columns: 1fr; }
    }

    .centre-card {
      background: #ffffff;
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s ease;
    }

    .centre-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .centre-id-badge {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--primary-700);
      background: var(--primary-50);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .centre-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--slate-900);
      margin-top: 2px;
    }

    .centre-sub {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #f8faf9;
      padding: 10px;
      border-radius: 10px;
    }

    .metric-box {
      display: flex;
      flex-direction: column;
    }

    .metric-lbl {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }

    .metric-val {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .util-box {
      display: flex;
      flex-direction: column;
    }

    .officer-info {
      font-size: 0.78rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      font-size: 0.875rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--slate-900);
    }

    .form-group input {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-light);
      font-size: 0.875rem;
      outline: none;
    }

    .alert-info {
      background: #dbeafe;
      border-left: 4px solid #2563eb;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #1e40af;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rec-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 12px 14px;
      border-radius: 8px;
      color: #92400e;
    }

    .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; }
    .flex-between { display: flex; align-items: center; justify-content: space-between; }
    .mt-3 { margin-top: 12px; }
    .mt-4 { margin-top: 16px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .text-xs { font-size: 0.75rem; }
    .font-bold { font-weight: 700; }
  `]
})
export class CentresComponent implements OnInit {
  centres: ProcurementCentre[] = [];
  searchQuery: string = '';
  selectedDistrict: string = 'ALL';
  selectedStatus: string = 'ALL';

  selectedCentreModal: ProcurementCentre | null = null;
  editCentreModal: ProcurementCentre | null = null;
  rerouteModalCentre: ProcurementCentre | null = null;

  editFormData: Partial<ProcurementCentre> = {};

  constructor(private procurementService: ProcurementService) {}

  ngOnInit() {
    this.procurementService.getCentres().subscribe(data => this.centres = data);
  }

  get filteredCentres(): ProcurementCentre[] {
    return this.centres.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.district.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.officerInCharge.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesDistrict = this.selectedDistrict === 'ALL' || c.district === this.selectedDistrict;
      const matchesStatus = this.selectedStatus === 'ALL' || c.status === this.selectedStatus;
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }

  openDetailModal(centre: ProcurementCentre) {
    this.selectedCentreModal = centre;
  }

  openEditModal(centre: ProcurementCentre) {
    this.editCentreModal = centre;
    this.editFormData = { ...centre };
  }

  saveCentreChanges() {
    if (this.editCentreModal) {
      this.procurementService.updateCentre(this.editCentreModal.id, this.editFormData);
      this.editCentreModal = null;
    }
  }

  openRerouteModal(centre: ProcurementCentre) {
    this.rerouteModalCentre = centre;
  }

  confirmReroute() {
    if (this.rerouteModalCentre) {
      this.procurementService.executeRerouteAction('ALT-101');
      this.rerouteModalCentre = null;
    }
  }

  openAddCentreModal() {
    const newId = `CTR-00${this.centres.length + 1}`;
    this.procurementService.updateCentre(newId, {
      id: newId,
      name: 'Rohtak Grain Procurement Yard',
      district: 'Rohtak',
      state: 'Haryana',
      location: 'Delhi Road Mandi, Rohtak',
      maxCapacity: 150,
      currentQueue: 10,
      capacityUtilization: 7,
      status: 'OPTIMAL',
      avgProcessingTimeMinutes: 20,
      predictedCongestion: 'LOW',
      activeGates: 5,
      officerInCharge: 'Shri Anil Hooda',
      contactMobile: '+91 98111 22233'
    });
  }
}
