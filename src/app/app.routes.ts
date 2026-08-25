import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CentresComponent } from './components/centres/centres';
import { FarmersComponent } from './components/farmers/farmers';
import { QueueComponent } from './components/queue/queue';
import { ProcurementComponent } from './components/procurement/procurement';
import { PaymentsComponent } from './components/payments/payments';
import { AiIntelligenceComponent } from './components/ai-intelligence/ai-intelligence';
import { ReportsComponent } from './components/reports/reports';
import { SettingsComponent } from './components/settings/settings';
import { AuditComponent } from './components/audit/audit';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'centres', component: CentresComponent, canActivate: [authGuard] },
  { path: 'farmers', component: FarmersComponent, canActivate: [authGuard] },
  { path: 'queue', component: QueueComponent, canActivate: [authGuard] },
  { path: 'procurement', component: ProcurementComponent, canActivate: [authGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [authGuard] },
  { path: 'ai-intelligence', component: AiIntelligenceComponent, canActivate: [authGuard] },
  { path: 'ai', redirectTo: 'ai-intelligence', pathMatch: 'full' },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'audit', component: AuditComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
