import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNotification, NotificationSeverity, NotificationType } from '../models/procurement.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([
    {
      id: 'NOTIF-101',
      title: 'HIGH CONGESTION PREDICTED',
      message: 'Karnal Central Procurement Centre is predicted to reach 92% capacity between 12:00 PM and 02:00 PM.',
      type: 'CONGESTION_ALERT',
      severity: 'CRITICAL',
      timestamp: '2 mins ago',
      read: false,
      relatedCentreId: 'CTR-001',
      relatedRoute: '/centres'
    },
    {
      id: 'NOTIF-102',
      title: 'QUEUE THRESHOLD EXCEEDED',
      message: 'Panipat Grain Procurement Centre live queue increased to 32 vehicles (Gate Check-in queue high).',
      type: 'QUEUE_UPDATE',
      severity: 'WARNING',
      timestamp: '8 mins ago',
      read: false,
      relatedCentreId: 'CTR-002',
      relatedRoute: '/queue'
    },
    {
      id: 'NOTIF-103',
      title: 'PROCUREMENT COMPLETED',
      message: 'Procurement receipt generated for Harpreet Kaur (FRM-10247, 38 Qtl Mustard).',
      type: 'PROCUREMENT_COMPLETED',
      severity: 'SUCCESS',
      timestamp: '15 mins ago',
      read: false,
      relatedFarmerId: 'FRM-10247',
      relatedRoute: '/farmers'
    },
    {
      id: 'NOTIF-104',
      title: 'PFMS DBT PAYOUT BATCH RELEASED',
      message: 'Direct Benefit Transfer payout batch submitted for 42 farmers (Total: ₹ 42,50,000).',
      type: 'PAYMENT_UPDATE',
      severity: 'INFO',
      timestamp: '25 mins ago',
      read: false,
      relatedRoute: '/payments'
    },
    {
      id: 'NOTIF-105',
      title: 'NEW FARMER REGISTRATION',
      message: 'Farmer Sukhdev Singh (FRM-10246) registered and assigned to Panipat Centre queue.',
      type: 'FARMER_REGISTRATION',
      severity: 'SUCCESS',
      timestamp: '40 mins ago',
      read: false,
      relatedFarmerId: 'FRM-10246',
      relatedRoute: '/farmers'
    }
  ]);

  private unreadCountSubject = new BehaviorSubject<number>(5);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unread = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unread);
  }

  /** Mark single notification as read */
  markAsRead(id: string) {
    const updated = this.notificationsSubject.value.map(n => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  /** Mark all notifications as read */
  markAllAsRead() {
    const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  /** Add new dynamic notification */
  addNotification(notifData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: AppNotification = {
      ...notifData,
      id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      read: false
    };

    const updated = [newNotif, ...this.notificationsSubject.value];
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  /** Remove notification */
  removeNotification(id: string) {
    const updated = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
    this.updateUnreadCount();
  }

  /** Development/Demo utility to simulate live alerts */
  simulateDemoAlert() {
    this.addNotification({
      title: 'SIMULATED CONGESTION WARNING',
      message: 'Sonipat Procurement Centre queue has expanded by 18% in the last 10 minutes.',
      type: 'CONGESTION_ALERT',
      severity: 'WARNING',
      relatedCentreId: 'CTR-005',
      relatedRoute: '/centres'
    });
  }
}
