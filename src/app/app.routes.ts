import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'insight',
    loadComponent: () => import('./pages/insight/insight.page').then( m => m.InsightPage)
  },
  {
    path: 'preferences',
    loadComponent: () => import('./pages/preferences/preferences.page').then( m => m.PreferencesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];
