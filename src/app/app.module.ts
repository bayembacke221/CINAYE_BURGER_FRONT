import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BurgerService} from "./services/burger.service";
import {ClientService} from "./services/client.service";
import {CommandeService} from "./services/commande.service";
import {PaiementService} from "./services/paiement.service";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {BurgerManagementComponent} from "./components/burger-management/burger-management.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PaiementManagementComponent } from './components/paiement-management/paiement-management.component';
import {CommandeManagementComponent} from "./components/commande-management/commande-management.component";
import { MenuComponent } from './components/menu/menu.component';
import {AuthInterceptor} from "./services/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    BurgerManagementComponent,
    SidebarComponent,
    MainLayoutComponent,
    CommandeManagementComponent,
    PaiementManagementComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [BurgerService, ClientService, CommandeService, PaiementService, provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
