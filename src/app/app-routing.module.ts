import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth-guard.guard";
import {BurgerManagementComponent} from "./components/burger-management/burger-management.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {MainLayoutComponent} from "./components/main-layout/main-layout.component";
import {CommandeManagementComponent} from "./components/commande-management/commande-management.component";
import {PaiementManagementComponent} from "./components/paiement-management/paiement-management.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'burgers', component: BurgerManagementComponent },
      { path: 'orders', component: CommandeManagementComponent },
      { path: 'payments', component: PaiementManagementComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
