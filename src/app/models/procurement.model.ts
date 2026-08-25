export type CentreStatus = 'OPTIMAL' | 'MODERATE' | 'CONGESTED' | 'CRITICAL' | 'ACTIVE' | 'INACTIVE';
export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
export type FarmerStatus = 'SCHEDULED' | 'WAITING' | 'IN_PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type QueueStatus = 'WAITING' | 'CHECKED_IN' | 'PROCESSING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
export type QualityGrade = 'GRADE_A' | 'GRADE_B' | 'REJECTED';
export type PaymentStatus = 'PFMS_APPROVED' | 'PROCESSING' | 'DISBURSED' | 'FAILED';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type UserRole = 'GOVERNMENT_ADMIN' | 'CENTRE_ADMIN' | 'FARMER';

export type NotificationType = 
  | 'CONGESTION_ALERT' 
  | 'QUEUE_UPDATE' 
  | 'CENTRE_UPDATE' 
  | 'FARMER_REGISTRATION' 
  | 'PROCUREMENT_COMPLETED' 
  | 'PAYMENT_UPDATE' 
  | 'SYSTEM_ALERT';

export type NotificationSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  relatedCentreId?: string;
  relatedFarmerId?: string;
  relatedRoute?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatarText: string;
  email: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  action: string;
  category: 'FARMER' | 'CENTRE' | 'QUEUE' | 'PAYMENT' | 'AI_REROUTE' | 'SYSTEM';
  entityName: string;
  previousValue?: string;
  newValue?: string;
  details: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  district: string;
  state: string;
  location: string;
  currentQueue: number;
  maxCapacity: number;
  capacityUtilization: number; // percentage
  status: CentreStatus;
  avgProcessingTimeMinutes: number;
  predictedCongestion: CongestionLevel;
  activeGates: number;
  officerInCharge: string;
  contactMobile: string;
}

export interface Farmer {
  id: string;
  regNo: string;
  name: string;
  village: string;
  district: string;
  state: string;
  mobile: string;
  landAcres: number;
  cropType: string;
  quantityQuintals: number;
  scheduledSlot: string;
  status: FarmerStatus;
  tokenNo: string;
  centreId: string;
  centreName: string;
}

export interface QueueToken {
  id: string;
  tokenNo: string;
  farmerId: string;
  farmerName: string;
  farmerRegNo: string;
  cropType: string;
  quantityQuintals: number;
  centreId: string;
  centreName: string;
  gateNo: string;
  arrivalTime: string;
  status: QueueStatus;
  estimatedWaitingTimeMinutes: number;
  stage: 'GATE_CHECKIN' | 'MOISTURE_TEST' | 'WEIGHBRIDGE' | 'QUALITY_APPROVAL' | 'BILLING_COMPLETED';
  isPriority: boolean;
}

export interface ProcurementTransaction {
  id: string;
  transactionNo: string;
  farmerName: string;
  farmerRegNo: string;
  centreName: string;
  cropType: string;
  weightQuintals: number;
  moisturePercent: number;
  qualityGrade: QualityGrade;
  mspRatePerQuintal: number;
  totalAmount: number;
  date: string;
  receiptStatus: 'VERIFIED' | 'PENDING';
}

export interface PaymentRecord {
  id: string;
  dbtRefNo: string;
  farmerName: string;
  farmerRegNo: string;
  bankName: string;
  accountNoMasked: string;
  ifscCode: string;
  amount: number;
  status: PaymentStatus;
  payoutDate: string;
}

export interface AIAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  centreId?: string;
  recommendedAction?: string;
  sourceCentre?: string;
  targetCentre?: string;
  affectedFarmersCount?: number;
  timestamp: string;
  executed?: boolean;
}

export interface DashboardStats {
  totalRegisteredFarmers: number;
  todayScheduledFarmers: number;
  currentlyWaitingFarmers: number;
  completedProcurements: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
  avgWaitingTimeMinutes: number;
  overallUtilizationPercent: number;
  predictedCongestionCentresCount: number;
  predictedCongestionLevel: CongestionLevel;
}

export interface CropDistribution {
  crop: string;
  percentage: number;
  tonnageQuintals: number;
}
