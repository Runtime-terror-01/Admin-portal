import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PageMeta {
  title: string;
  breadcrumb: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.collapsedSubject.asObservable();

  private mobileOpenSubject = new BehaviorSubject<boolean>(false);
  isMobileOpen$ = this.mobileOpenSubject.asObservable();

  private pageMetaSubject = new BehaviorSubject<PageMeta>({
    title: 'Dashboard',
    breadcrumb: 'Operations Command Centre'
  });
  pageMeta$ = this.pageMetaSubject.asObservable();

  private routeMetaMap: Record<string, PageMeta> = {
    '/dashboard': {
      title: 'Dashboard',
      breadcrumb: 'Procurement Command Centre'
    },
    '/centres': {
      title: 'Procurement Centres',
      breadcrumb: 'Agricultural Mandis Directory & Capacity'
    },
    '/farmers': {
      title: 'Farmers Directory',
      breadcrumb: 'Registered Farmer Accounts & Gate Passes'
    },
    '/queue': {
      title: 'Queue Management',
      breadcrumb: 'Live Mandi Gate Entry & Token Monitor'
    },
    '/procurement': {
      title: 'Procurement Tracking',
      breadcrumb: 'Moisture Testing & Tonnage Records'
    },
    '/payments': {
      title: 'Payments & DBT',
      breadcrumb: 'Direct Benefit Transfer & PFMS Payouts'
    },
    '/ai-intelligence': {
      title: 'AI Intelligence',
      breadcrumb: 'Congestion Rerouting & Predictive Load Balancing'
    },
    '/reports': {
      title: 'Reports & Analytics',
      breadcrumb: 'State Procurement Summaries & PDF Exports'
    },
    '/settings': {
      title: 'System Settings',
      breadcrumb: 'Mandi Parameters & Spring Boot REST Endpoint'
    },
    '/audit': {
      title: 'Audit Logs',
      breadcrumb: 'Government Administrative Master Log Trail'
    }
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        const meta = this.routeMetaMap[url] || {
          title: 'AgriProcure AI',
          breadcrumb: 'Government Procurement Portal'
        };
        this.pageMetaSubject.next(meta);
        this.mobileOpenSubject.next(false);
      });
  }

  toggleSidebar() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  toggleMobileMenu() {
    this.mobileOpenSubject.next(!this.mobileOpenSubject.value);
  }

  closeMobileMenu() {
    this.mobileOpenSubject.next(false);
  }
}
