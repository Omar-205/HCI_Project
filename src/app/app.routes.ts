import { Routes } from '@angular/router';
import { ElectricBusComponent } from './electric-bus/electric-bus';

export const routes: Routes = [
    { path: 'electric-bus', component: ElectricBusComponent },
    { path: '', redirectTo: '/electric-bus', pathMatch: 'full' }
];
