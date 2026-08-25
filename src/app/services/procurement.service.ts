import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProcurementCentre,
  Farmer,
  QueueToken,
  ProcurementTransaction,
  PaymentRecord,
  AIAlert,
  DashboardStats,
  QueueStatus,
  AuditLog,
  CropDistribution
} from '../models/procurement.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProcurementService {

  // Stateful BehaviorSubjects
  private centresSubject = new BehaviorSubject<ProcurementCentre[]>([
    {
      id: 'CTR-001',
      name: 'Karnal Central Procurement Centre',
      district: 'Karnal',
      state: 'Haryana',
      location: 'GT Road Mandi Complex, Karnal',
      currentQueue: 32,
      maxCapacity: 150,
      capacityUtilization: 85,
      status: 'CONGESTED',
      avgProcessingTimeMinutes: 42,
      predictedCongestion: 'HIGH',
      activeGates: 4,
      officerInCharge: 'Shri Rajesh Sharma',
      contactMobile: '+91 98765 43210'
    },
    {
      id: 'CTR-002',
      name: 'Panipat Grain Procurement Centre',
      district: 'Panipat',
      state: 'Haryana',
      location: 'Industrial Area Phase 2, Panipat',
      currentQueue: 18,
      maxCapacity: 140,
      capacityUtilization: 52,
      status: 'MODERATE',
      avgProcessingTimeMinutes: 28,
      predictedCongestion: 'MEDIUM',
      activeGates: 5,
      officerInCharge: 'Shri Vikram Singh',
      contactMobile: '+91 98123 45678'
    },
    {
      id: 'CTR-003',
      name: 'Kurukshetra Mandi Centre',
      district: 'Kurukshetra',
      state: 'Haryana',
      location: 'Sector 7 Grain Market, Kurukshetra',
      currentQueue: 8,
      maxCapacity: 160,
      capacityUtilization: 24,
      status: 'OPTIMAL',
      avgProcessingTimeMinutes: 22,
      predictedCongestion: 'LOW',
      activeGates: 6,
      officerInCharge: 'Sardar Jasbir Singh',
      contactMobile: '+91 94567 89012'
    },
    {
      id: 'CTR-004',
      name: 'Ambala Agricultural Centre',
      district: 'Ambala',
      state: 'Haryana',
      location: 'Mandi Board Yard, Ambala Cantt',
      currentQueue: 24,
      maxCapacity: 130,
      capacityUtilization: 74,
      status: 'MODERATE',
      avgProcessingTimeMinutes: 35,
      predictedCongestion: 'MEDIUM',
      activeGates: 4,
      officerInCharge: 'Shri Suresh Verma',
      contactMobile: '+91 97890 12345'
    },
    {
      id: 'CTR-005',
      name: 'Sonipat Procurement Centre',
      district: 'Sonipat',
      state: 'Haryana',
      location: 'Gohana Road Mandi, Sonipat',
      currentQueue: 29,
      maxCapacity: 120,
      capacityUtilization: 92,
      status: 'CRITICAL',
      avgProcessingTimeMinutes: 54,
      predictedCongestion: 'SEVERE',
      activeGates: 3,
      officerInCharge: 'Shri Amit Kumar',
      contactMobile: '+91 93210 98765'
    }
  ]);

  private farmersSubject = new BehaviorSubject<Farmer[]>([
    {
      id: 'FRM-10245',
      regNo: 'HR-KRN-2026-10245',
      name: 'Rajesh Kumar',
      village: 'Rampur',
      district: 'Karnal',
      state: 'Haryana',
      mobile: '+91 98140 11223',
      landAcres: 12.5,
      cropType: 'Paddy',
      quantityQuintals: 42.5,
      scheduledSlot: 'Today, 10:30 AM',
      status: 'WAITING',
      tokenNo: 'KRN-101',
      centreId: 'CTR-001',
      centreName: 'Karnal Central Procurement Centre'
    },
    {
      id: 'FRM-10246',
      regNo: 'HR-PNP-2026-10246',
      name: 'Sukhdev Singh',
      village: 'Samalkha',
      district: 'Panipat',
      state: 'Haryana',
      mobile: '+91 94160 55667',
      landAcres: 8.0,
      cropType: 'Wheat',
      quantityQuintals: 65.0,
      scheduledSlot: 'Today, 11:00 AM',
      status: 'IN_PROCESSING',
      tokenNo: 'PNP-102',
      centreId: 'CTR-002',
      centreName: 'Panipat Grain Procurement Centre'
    },
    {
      id: 'FRM-10247',
      regNo: 'HR-KKR-2026-10247',
      name: 'Harpreet Kaur',
      village: 'Pehowa',
      district: 'Kurukshetra',
      state: 'Haryana',
      mobile: '+91 98720 99887',
      landAcres: 15.0,
      cropType: 'Mustard',
      quantityQuintals: 38.0,
      scheduledSlot: 'Today, 09:15 AM',
      status: 'COMPLETED',
      tokenNo: 'KKR-095',
      centreId: 'CTR-003',
      centreName: 'Kurukshetra Mandi Centre'
    },
    {
      id: 'FRM-10248',
      regNo: 'HR-AMB-2026-10248',
      name: 'Ramesh Patel',
      village: 'Naraingarh',
      district: 'Ambala',
      state: 'Haryana',
      mobile: '+91 94400 33445',
      landAcres: 6.5,
      cropType: 'Cotton',
      quantityQuintals: 28.0,
      scheduledSlot: 'Today, 11:30 AM',
      status: 'WAITING',
      tokenNo: 'AMB-108',
      centreId: 'CTR-004',
      centreName: 'Ambala Agricultural Centre'
    },
    {
      id: 'FRM-10249',
      regNo: 'HR-SNP-2026-10249',
      name: 'Balwan Singh',
      village: 'Gohana',
      district: 'Sonipat',
      state: 'Haryana',
      mobile: '+91 98960 77112',
      landAcres: 10.0,
      cropType: 'Chana',
      quantityQuintals: 52.0,
      scheduledSlot: 'Today, 12:00 PM',
      status: 'SCHEDULED',
      tokenNo: 'SNP-115',
      centreId: 'CTR-005',
      centreName: 'Sonipat Procurement Centre'
    }
  ]);

  private queueSubject = new BehaviorSubject<QueueToken[]>([
    {
      id: 'QT-201',
      tokenNo: 'KRN-101',
      farmerId: 'FRM-10245',
      farmerName: 'Rajesh Kumar',
      farmerRegNo: 'HR-KRN-2026-10245',
      cropType: 'Paddy',
      quantityQuintals: 42.5,
      centreId: 'CTR-001',
      centreName: 'Karnal Central Procurement Centre',
      gateNo: 'Gate #2',
      arrivalTime: '10:15 AM',
      status: 'CHECKED_IN',
      estimatedWaitingTimeMinutes: 25,
      stage: 'MOISTURE_TEST',
      isPriority: false
    },
    {
      id: 'QT-202',
      tokenNo: 'PNP-102',
      farmerId: 'FRM-10246',
      farmerName: 'Sukhdev Singh',
      farmerRegNo: 'HR-PNP-2026-10246',
      cropType: 'Wheat',
      quantityQuintals: 65.0,
      centreId: 'CTR-002',
      centreName: 'Panipat Grain Procurement Centre',
      gateNo: 'Gate #1',
      arrivalTime: '10:45 AM',
      status: 'PROCESSING',
      estimatedWaitingTimeMinutes: 15,
      stage: 'WEIGHBRIDGE',
      isPriority: true
    },
    {
      id: 'QT-203',
      tokenNo: 'AMB-108',
      farmerId: 'FRM-10248',
      farmerName: 'Ramesh Patel',
      farmerRegNo: 'HR-AMB-2026-10248',
      cropType: 'Cotton',
      quantityQuintals: 28.0,
      centreId: 'CTR-004',
      centreName: 'Ambala Agricultural Centre',
      gateNo: 'Gate #3',
      arrivalTime: '11:00 AM',
      status: 'WAITING',
      estimatedWaitingTimeMinutes: 35,
      stage: 'GATE_CHECKIN',
      isPriority: false
    },
    {
      id: 'QT-204',
      tokenNo: 'SNP-115',
      farmerId: 'FRM-10249',
      farmerName: 'Balwan Singh',
      farmerRegNo: 'HR-SNP-2026-10249',
      cropType: 'Chana',
      quantityQuintals: 52.0,
      centreId: 'CTR-005',
      centreName: 'Sonipat Procurement Centre',
      gateNo: 'Gate #1',
      arrivalTime: '11:20 AM',
      status: 'WAITING',
      estimatedWaitingTimeMinutes: 50,
      stage: 'GATE_CHECKIN',
      isPriority: false
    }
  ]);

  private aiAlertsSubject = new BehaviorSubject<AIAlert[]>([
    {
      id: 'ALT-101',
      severity: 'CRITICAL',
      title: 'HIGH CONGESTION PREDICTED',
      message: 'Karnal Central Procurement Centre is predicted to reach 92% utilization between 12:00 PM and 2:00 PM.',
      centreId: 'CTR-001',
      sourceCentre: 'Karnal Central Procurement Centre',
      targetCentre: 'Kurukshetra Mandi Centre',
      affectedFarmersCount: 25,
      recommendedAction: 'Redirect 25 scheduled farmers to Kurukshetra Mandi Centre (Distance: 32km, spare capacity: 76%).',
      timestamp: '10:15 AM Today',
      executed: false
    },
    {
      id: 'ALT-102',
      severity: 'WARNING',
      title: 'Moisture Level Threshold Exceeded',
      message: 'Lot #412 at Panipat Grain Centre showed 16.8% moisture (Max MSP allowable: 14%). Recommended grain drying advisory.',
      centreId: 'CTR-002',
      timestamp: '10:45 AM Today',
      executed: false
    },
    {
      id: 'ALT-103',
      severity: 'INFO',
      title: 'Spare Capacity Optimization Available',
      message: 'Kurukshetra Mandi Centre currently operating at 24% capacity with 6 open gates.',
      centreId: 'CTR-003',
      timestamp: '09:30 AM Today',
      executed: false
    }
  ]);

  private paymentsSubject = new BehaviorSubject<PaymentRecord[]>([
    {
      id: 'PAY-301',
      dbtRefNo: 'DBT-2026-PFMS-9901',
      farmerName: 'Harpreet Kaur',
      farmerRegNo: 'HR-KKR-2026-10247',
      bankName: 'State Bank of India (SBI)',
      accountNoMasked: 'XXXX-XXXX-4892',
      ifscCode: 'SBIN0001234',
      amount: 215400,
      status: 'DISBURSED',
      payoutDate: 'Today, 10:00 AM'
    },
    {
      id: 'PAY-302',
      dbtRefNo: 'DBT-2026-PFMS-9902',
      farmerName: 'Gurmail Singh',
      farmerRegNo: 'HR-KRN-2026-10210',
      bankName: 'Punjab National Bank (PNB)',
      accountNoMasked: 'XXXX-XXXX-9012',
      ifscCode: 'PUNB0112233',
      amount: 184500,
      status: 'PROCESSING',
      payoutDate: 'Batch Processing'
    },
    {
      id: 'PAY-303',
      dbtRefNo: 'DBT-2026-PFMS-9903',
      farmerName: 'Devendra Patel',
      farmerRegNo: 'HR-AMB-2026-10190',
      bankName: 'HDFC Bank',
      accountNoMasked: 'XXXX-XXXX-3341',
      ifscCode: 'HDFC0000451',
      amount: 142000,
      status: 'PFMS_APPROVED',
      payoutDate: 'Pending Release'
    }
  ]);

  private auditLogsSubject = new BehaviorSubject<AuditLog[]>([
    {
      id: 'AUD-901',
      timestamp: '25 Aug 2026, 07:42 PM',
      adminId: 'GOV-001',
      adminName: 'Shri R.K. Sharma',
      category: 'CENTRE',
      action: 'Centre Capacity Updated',
      entityName: 'Karnal Central Procurement Centre',
      previousValue: '100 Max Capacity',
      newValue: '150 Max Capacity',
      details: 'Increased Mandi Gate daily vehicle capacity allowance by 50 units for peak harvesting season.'
    },
    {
      id: 'AUD-902',
      timestamp: '25 Aug 2026, 06:15 PM',
      adminId: 'GOV-001',
      adminName: 'Shri R.K. Sharma',
      category: 'FARMER',
      action: 'Farmer Registered',
      entityName: 'Rajesh Kumar (FRM-10245)',
      newValue: 'Registered (Paddy 42.5 Qtl)',
      details: 'Created farmer account and assigned to Karnal Central Procurement Centre queue.'
    },
    {
      id: 'AUD-903',
      timestamp: '25 Aug 2026, 05:30 PM',
      adminId: 'GOV-001',
      adminName: 'Shri R.K. Sharma',
      category: 'AI_REROUTE',
      action: 'AI Reroute Executed',
      entityName: 'ALT-101 Congestion Reroute',
      previousValue: 'Karnal Centre (85%)',
      newValue: 'Kurukshetra Centre (24%)',
      details: 'Redirected 25 scheduled farmers from Karnal to Kurukshetra Mandi to balance queue traffic.'
    }
  ]);

  private completedCount = 164;

  constructor(private notificationService: NotificationService) {}

  // Observable Getters
  getCentres(): Observable<ProcurementCentre[]> {
    return this.centresSubject.asObservable();
  }

  getFarmers(): Observable<Farmer[]> {
    return this.farmersSubject.asObservable();
  }

  getQueue(): Observable<QueueToken[]> {
    return this.queueSubject.asObservable();
  }

  getPayments(): Observable<PaymentRecord[]> {
    return this.paymentsSubject.asObservable();
  }

  getAIAlerts(): Observable<AIAlert[]> {
    return this.aiAlertsSubject.asObservable();
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.auditLogsSubject.asObservable();
  }

  getCropDistribution(): Observable<CropDistribution[]> {
    return new BehaviorSubject<CropDistribution[]>([
      { crop: 'Paddy', percentage: 42, tonnageQuintals: 7750 },
      { crop: 'Wheat', percentage: 31, tonnageQuintals: 5720 },
      { crop: 'Mustard', percentage: 14, tonnageQuintals: 2580 },
      { crop: 'Cotton', percentage: 8, tonnageQuintals: 1475 },
      { crop: 'Chana', percentage: 5, tonnageQuintals: 925 }
    ]).asObservable();
  }

  getStats(): Observable<DashboardStats> {
    const farmers = this.farmersSubject.value;
    const queue = this.queueSubject.value;
    const centres = this.centresSubject.value;

    const totalReg = 1248 + farmers.length - 5;
    const todaySched = 286;
    const currentlyWaiting = queue.filter(q => q.status === 'WAITING' || q.status === 'CHECKED_IN' || q.status === 'PROCESSING').length;
    const completed = this.completedCount;

    const totalCap = centres.reduce((acc, c) => acc + c.maxCapacity, 0);
    const totalQ = centres.reduce((acc, c) => acc + c.currentQueue, 0);
    const avgUtil = totalCap > 0 ? Math.round((totalQ / totalCap) * 100) : 74;

    const congestedCount = centres.filter(c => c.status === 'CONGESTED' || c.status === 'CRITICAL').length;

    const stats: DashboardStats = {
      totalRegisteredFarmers: totalReg,
      todayScheduledFarmers: todaySched,
      currentlyWaitingFarmers: currentlyWaiting,
      completedProcurements: completed,
      pendingPaymentsCount: 42,
      pendingPaymentsAmount: 4250000,
      avgWaitingTimeMinutes: 42,
      overallUtilizationPercent: avgUtil,
      predictedCongestionCentresCount: congestedCount,
      predictedCongestionLevel: congestedCount > 1 ? 'HIGH' : 'MEDIUM'
    };

    return new BehaviorSubject<DashboardStats>(stats).asObservable();
  }

  // --- REACTIVE ACTIONS WITH AUDIT LOGGING & NOTIFICATIONS ---

  private logAudit(logData: Omit<AuditLog, 'id' | 'timestamp' | 'adminId' | 'adminName'>) {
    const newLog: AuditLog = {
      ...logData,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      adminId: 'GOV-001',
      adminName: 'Shri R.K. Sharma'
    };

    this.auditLogsSubject.next([newLog, ...this.auditLogsSubject.value]);
  }

  /** Add Farmer & Generate Queue Token */
  addFarmer(farmerData: Omit<Farmer, 'id' | 'tokenNo' | 'status'>) {
    const newId = `FRM-${Math.floor(10250 + Math.random() * 1000)}`;
    const prefix = farmerData.district.substring(0, 3).toUpperCase();
    const tokenNum = Math.floor(120 + Math.random() * 80);
    const newTokenNo = `${prefix}-${tokenNum}`;

    const newFarmer: Farmer = {
      ...farmerData,
      id: newId,
      tokenNo: newTokenNo,
      status: 'WAITING'
    };

    this.farmersSubject.next([newFarmer, ...this.farmersSubject.value]);

    const newQueueToken: QueueToken = {
      id: `QT-${Math.floor(300 + Math.random() * 500)}`,
      tokenNo: newTokenNo,
      farmerId: newId,
      farmerName: farmerData.name,
      farmerRegNo: farmerData.regNo,
      cropType: farmerData.cropType,
      quantityQuintals: farmerData.quantityQuintals,
      centreId: farmerData.centreId,
      centreName: farmerData.centreName,
      gateNo: 'Gate #1',
      arrivalTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING',
      estimatedWaitingTimeMinutes: 30,
      stage: 'GATE_CHECKIN',
      isPriority: false
    };

    this.queueSubject.next([newQueueToken, ...this.queueSubject.value]);
    this.updateCentreQueue(farmerData.centreId, 1);

    this.logAudit({
      category: 'FARMER',
      action: 'Farmer Registered',
      entityName: `${farmerData.name} (${newId})`,
      newValue: `Assigned to ${farmerData.centreName}`,
      details: `Registered farmer for ${farmerData.cropType} (${farmerData.quantityQuintals} Qtl) and generated Token ${newTokenNo}.`
    });

    this.notificationService.addNotification({
      title: 'NEW FARMER REGISTRATION',
      message: `Farmer ${farmerData.name} (${newId}) registered and assigned to ${farmerData.centreName}.`,
      type: 'FARMER_REGISTRATION',
      severity: 'SUCCESS',
      relatedFarmerId: newId,
      relatedRoute: '/farmers'
    });
  }

  /** Government Reassign Farmer to Another Mandi Centre */
  reassignFarmer(farmerId: string, newCentreId: string) {
    const targetCentre = this.centresSubject.value.find(c => c.id === newCentreId);
    if (!targetCentre) return;

    let oldCentreName = '';
    let farmerName = '';
    let oldCentreId = '';

    const updatedFarmers = this.farmersSubject.value.map(f => {
      if (f.id === farmerId) {
        oldCentreName = f.centreName;
        oldCentreId = f.centreId;
        farmerName = f.name;
        return {
          ...f,
          centreId: targetCentre.id,
          centreName: targetCentre.name
        };
      }
      return f;
    });

    this.farmersSubject.next(updatedFarmers);

    const updatedQueue = this.queueSubject.value.map(q => {
      if (q.farmerId === farmerId) {
        return {
          ...q,
          centreId: targetCentre.id,
          centreName: targetCentre.name
        };
      }
      return q;
    });

    this.queueSubject.next(updatedQueue);

    if (oldCentreId) {
      this.updateCentreQueue(oldCentreId, -1);
    }
    this.updateCentreQueue(targetCentre.id, 1);

    this.logAudit({
      category: 'FARMER',
      action: 'Farmer Mandi Reassigned',
      entityName: `${farmerName} (${farmerId})`,
      previousValue: oldCentreName,
      newValue: targetCentre.name,
      details: `Government Admin reassigned farmer slot from ${oldCentreName} to ${targetCentre.name}.`
    });

    this.notificationService.addNotification({
      title: 'FARMER REASSIGNED',
      message: `Farmer ${farmerName} slot reassigned from ${oldCentreName} to ${targetCentre.name}.`,
      type: 'QUEUE_UPDATE',
      severity: 'INFO',
      relatedFarmerId: farmerId,
      relatedRoute: '/farmers'
    });
  }

  /** Update Farmer */
  updateFarmer(farmerId: string, updatedFields: Partial<Farmer>) {
    const farmer = this.farmersSubject.value.find(f => f.id === farmerId);
    const farmers = this.farmersSubject.value.map(f => {
      if (f.id === farmerId) {
        return { ...f, ...updatedFields };
      }
      return f;
    });
    this.farmersSubject.next(farmers);

    if (farmer) {
      this.logAudit({
        category: 'FARMER',
        action: 'Farmer Profile Updated',
        entityName: `${farmer.name} (${farmerId})`,
        details: `Government Admin updated farmer records for ${farmer.name}.`
      });
    }
  }

  /** Update Queue Token Status */
  updateQueueTokenStatus(tokenId: string, newStatus: QueueStatus, nextStage?: QueueToken['stage']) {
    let affectedCentreId = '';
    let tokenNo = '';
    let oldStatus = '';
    let farmerName = '';

    const updatedQueue = this.queueSubject.value.map(token => {
      if (token.id === tokenId) {
        affectedCentreId = token.centreId;
        tokenNo = token.tokenNo;
        oldStatus = token.status;
        farmerName = token.farmerName;
        const stage = nextStage || (newStatus === 'PROCESSING' ? 'WEIGHBRIDGE' : newStatus === 'COMPLETED' ? 'BILLING_COMPLETED' : token.stage);
        return {
          ...token,
          status: newStatus,
          stage
        };
      }
      return token;
    });

    this.queueSubject.next(updatedQueue);

    if (newStatus === 'COMPLETED') {
      this.completedCount++;
      if (affectedCentreId) this.updateCentreQueue(affectedCentreId, -1);
      
      this.notificationService.addNotification({
        title: 'PROCUREMENT COMPLETED',
        message: `Procurement for ${farmerName} (Token ${tokenNo}) completed successfully.`,
        type: 'PROCUREMENT_COMPLETED',
        severity: 'SUCCESS',
        relatedRoute: '/queue'
      });
    } else if (newStatus === 'CANCELLED' || newStatus === 'SKIPPED') {
      if (affectedCentreId) this.updateCentreQueue(affectedCentreId, -1);

      this.notificationService.addNotification({
        title: `TOKEN ${newStatus}`,
        message: `Token ${tokenNo} for ${farmerName} marked as ${newStatus}.`,
        type: 'QUEUE_UPDATE',
        severity: 'WARNING',
        relatedRoute: '/queue'
      });
    }

    this.logAudit({
      category: 'QUEUE',
      action: `Token Status Changed to ${newStatus}`,
      entityName: `Token ${tokenNo}`,
      previousValue: oldStatus,
      newValue: newStatus,
      details: `Master override: changed queue status for Token ${tokenNo} from ${oldStatus} to ${newStatus}.`
    });
  }

  /** Call Next Token */
  callNextToken() {
    const queue = this.queueSubject.value;
    const waitingToken = queue.find(q => q.status === 'WAITING' || q.status === 'CHECKED_IN');
    if (waitingToken) {
      this.updateQueueTokenStatus(waitingToken.id, 'PROCESSING', 'WEIGHBRIDGE');
    }
  }

  /** Priority Pass */
  addPriorityPass() {
    const tokenNo = `PRIORITY-${Math.floor(100 + Math.random() * 900)}`;
    const priorityToken: QueueToken = {
      id: `QT-PRIO-${Date.now()}`,
      tokenNo: tokenNo,
      farmerId: 'FRM-PRIO-01',
      farmerName: 'Sardarni Baljeet Kaur',
      farmerRegNo: 'HR-KRN-2026-PRIO',
      cropType: 'Paddy',
      quantityQuintals: 75.0,
      centreId: 'CTR-001',
      centreName: 'Karnal Central Procurement Centre',
      gateNo: 'Fast-Track Gate',
      arrivalTime: 'Just Now',
      status: 'CHECKED_IN',
      estimatedWaitingTimeMinutes: 10,
      stage: 'GATE_CHECKIN',
      isPriority: true
    };
    this.queueSubject.next([priorityToken, ...this.queueSubject.value]);

    this.logAudit({
      category: 'QUEUE',
      action: 'Fast-Track Priority Pass Issued',
      entityName: `Token ${tokenNo}`,
      newValue: 'Fast-Track Gate Entry',
      details: 'Issued fast-track priority pass for senior farmer entry.'
    });

    this.notificationService.addNotification({
      title: 'FAST-TRACK PASS ISSUED',
      message: `Priority token ${tokenNo} issued for Gate Entry.`,
      type: 'QUEUE_UPDATE',
      severity: 'INFO',
      relatedRoute: '/queue'
    });
  }

  /** Edit Mandi / Centre Details */
  updateCentre(centreId: string, updatedFields: Partial<ProcurementCentre>) {
    let centreName = '';
    let oldVal = '';
    let newVal = '';

    const updatedCentres = this.centresSubject.value.map(c => {
      if (c.id === centreId) {
        centreName = c.name;
        if (updatedFields.maxCapacity !== undefined && updatedFields.maxCapacity !== c.maxCapacity) {
          oldVal = `${c.maxCapacity} Max Cap`;
          newVal = `${updatedFields.maxCapacity} Max Cap`;
        }
        const newMax = updatedFields.maxCapacity ?? c.maxCapacity;
        const newQ = updatedFields.currentQueue ?? c.currentQueue;
        const newUtil = Math.round((newQ / newMax) * 100);
        
        let newStatus = c.status;
        if (newUtil >= 90) newStatus = 'CRITICAL';
        else if (newUtil >= 75) newStatus = 'CONGESTED';
        else if (newUtil >= 50) newStatus = 'MODERATE';
        else newStatus = 'OPTIMAL';

        return {
          ...c,
          ...updatedFields,
          capacityUtilization: newUtil,
          status: updatedFields.status || newStatus
        };
      }
      return c;
    });
    this.centresSubject.next(updatedCentres);

    this.logAudit({
      category: 'CENTRE',
      action: 'Centre Parameters Updated',
      entityName: centreName || centreId,
      previousValue: oldVal,
      newValue: newVal,
      details: `Government Admin updated operating parameters for ${centreName || centreId}.`
    });

    this.notificationService.addNotification({
      title: 'CENTRE CAPACITY UPDATED',
      message: `${centreName || centreId} operating capacity updated to ${updatedFields.maxCapacity || 'new parameters'}.`,
      type: 'CENTRE_UPDATE',
      severity: 'WARNING',
      relatedCentreId: centreId,
      relatedRoute: '/centres'
    });
  }

  private updateCentreQueue(centreId: string, delta: number) {
    const centres = this.centresSubject.value.map(c => {
      if (c.id === centreId) {
        const newQ = Math.max(0, c.currentQueue + delta);
        const newUtil = Math.round((newQ / c.maxCapacity) * 100);
        let newStatus = c.status;
        if (newUtil >= 90) newStatus = 'CRITICAL';
        else if (newUtil >= 75) newStatus = 'CONGESTED';
        else if (newUtil >= 50) newStatus = 'MODERATE';
        else newStatus = 'OPTIMAL';

        return {
          ...c,
          currentQueue: newQ,
          capacityUtilization: newUtil,
          status: newStatus
        };
      }
      return c;
    });
    this.centresSubject.next(centres);
  }

  /** AI Reroute Action execution */
  executeRerouteAction(alertId: string) {
    const alerts = this.aiAlertsSubject.value.map(a => {
      if (a.id === alertId) {
        return { ...a, executed: true };
      }
      return a;
    });
    this.aiAlertsSubject.next(alerts);

    const centres = this.centresSubject.value.map(c => {
      if (c.id === 'CTR-001') {
        const newQ = Math.max(10, c.currentQueue - 15);
        return {
          ...c,
          currentQueue: newQ,
          capacityUtilization: Math.round((newQ / c.maxCapacity) * 100),
          status: 'MODERATE' as const,
          predictedCongestion: 'MEDIUM' as const
        };
      }
      if (c.id === 'CTR-003') {
        const newQ = c.currentQueue + 15;
        return {
          ...c,
          currentQueue: newQ,
          capacityUtilization: Math.round((newQ / c.maxCapacity) * 100),
          status: 'OPTIMAL' as const
        };
      }
      return c;
    });
    this.centresSubject.next(centres);

    this.logAudit({
      category: 'AI_REROUTE',
      action: 'AI Congestion Reroute Order Dispatched',
      entityName: 'Karnal -> Kurukshetra Reroute',
      previousValue: 'Karnal (85%)',
      newValue: 'Kurukshetra (24%)',
      details: 'Executed AI recommendation: dispatched SMS alerts redirecting 25 scheduled farmers from Karnal to Kurukshetra.'
    });

    this.notificationService.addNotification({
      title: 'AI REROUTE DISPATCHED',
      message: 'Redirected 25 scheduled farmers from Karnal to Kurukshetra Mandi.',
      type: 'CONGESTION_ALERT',
      severity: 'CRITICAL',
      relatedRoute: '/ai-intelligence'
    });
  }

  /** Approve Payment Disbursal */
  approvePayment(paymentId: string) {
    let dbtRef = '';
    const payments = this.paymentsSubject.value.map(p => {
      if (p.id === paymentId) {
        dbtRef = p.dbtRefNo;
        return {
          ...p,
          status: 'DISBURSED' as const,
          payoutDate: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' Today'
        };
      }
      return p;
    });
    this.paymentsSubject.next(payments);

    this.logAudit({
      category: 'PAYMENT',
      action: 'PFMS DBT Disbursal Released',
      entityName: dbtRef || paymentId,
      previousValue: 'PFMS_APPROVED',
      newValue: 'DISBURSED',
      details: `Released direct benefit transfer payout for ${dbtRef}.`
    });

    this.notificationService.addNotification({
      title: 'DBT PAYOUT RELEASED',
      message: `Direct Benefit Transfer ${dbtRef} successfully disbursed.`,
      type: 'PAYMENT_UPDATE',
      severity: 'SUCCESS',
      relatedRoute: '/payments'
    });
  }
}
