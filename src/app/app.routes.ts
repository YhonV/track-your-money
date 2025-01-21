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
    path: 'planner',
    loadComponent: () => import('./pages/planner/planner.page').then( m => m.PlannerPage)
  },
  {
    path: 'preferences',
    loadComponent: () => import('./pages/preferences/preferences.page').then( m => m.PreferencesPage)
  },
];
