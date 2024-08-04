import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {BurgerService} from "../../services/burger.service";
import {CommandeService} from "../../services/commande.service";
import {PaiementService} from "../../services/paiement.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  statistiquesJour: any;
  burgers: any[] = [];
  paiementsRecents: any[] = [];
  commandesEnCours: any[] = [];
  commandesValidees: any[] = [];
  commandesAnnulees: any[] = [];

  constructor(
    private burgerService: BurgerService,
    private commandeService: CommandeService,
    private paiementService: PaiementService,

  ) {}

  ngOnInit() {

    this.loadStatistiquesJour();
    this.loadBurgers();
    this.loadPaiementsRecents();
    this.loadCommandes();

  }



  loadStatistiquesJour() {
    this.commandeService.getStatistiquesJour().subscribe(
      data => this.statistiquesJour = data,
      error => console.error('Error loading statistiques jour', error)
    );
  }

  loadBurgers() {
    this.burgerService.getAll().subscribe(
      data => this.burgers = data,
      error => console.error('Error loading burgers', error)
    );
  }

  loadPaiementsRecents() {
    // Implement this method to load recent payments
  }

  loadCommandes() {
    this.commandeService.getCommandesEnCours().subscribe(
      (data:any) => {
        this.commandesEnCours = data.data
      },
      error => console.error('Error loading commandes en cours', error)
    );

    this.commandeService.getCommandesValidees().subscribe(
      (data:any) => {this.commandesValidees = data.data},
      error => console.error('Error loading commandes validées', error)
    );

    this.commandeService.getCommandesAnnulees().subscribe(
      (data:any) => {this.commandesAnnulees = data.data},
      error => console.error('Error loading commandes annulées', error)
    );
  }


}
