import { Component, OnInit } from '@angular/core';
import { Commande } from "../../models/commande.model";
import { CommandeService } from "../../services/commande.service";
import { Client } from "../../models/client.model";
import { Burger } from "../../models/burger.model";
import { ClientService } from "../../services/client.service";
import { BurgerService } from "../../services/burger.service";

@Component({
  selector: 'app-commande-management',
  templateUrl: './commande-management.component.html',
  styleUrls: ['./commande-management.component.css']
})
export class CommandeManagementComponent implements OnInit {
  commandes: (Commande & { client?: Client, burger?: Burger })[] = [];
  commandesEnCours: Commande[] = [];
  commandesValidees: Commande[] = [];
  commandesAnnulees: Commande[] = [];
  statistiquesJour: any;
  burgers: Burger[] = [];
  filteredBurgers: Burger[] = [];

  constructor(
    private commandeService: CommandeService,
    private clientService: ClientService,
    private burgerService: BurgerService,
  ) {
    this.burgers = [];
    this.filteredBurgers = [];
  }

  ngOnInit(): void {
    this.loadCommandes();
    this.loadStatistiquesJour();
    this.loadBurgers();
  }

  loadCommandes(): void {
    this.commandeService.getAll().subscribe(
      (commandes:any) => {
        this.commandes = Array.isArray(commandes.data) ? commandes.data : [];
        if (this.commandes.length > 0) {
          this.loadCommandesDetails();
        }
      },
      (error) => console.error('Erreur lors du chargement des commandes', error)
    );

    this.commandeService.getCommandesEnCours().subscribe(
      (data:any) => {this.commandesEnCours = data.data},
      (error) => console.error('Erreur lors du chargement des commandes en cours', error)
    );
    this.commandeService.getCommandesValidees().subscribe(
      (data:any) => {this.commandesValidees = data.data},
      (error) => console.error('Erreur lors du chargement des commandes validées', error)
    );
    this.commandeService.getCommandesAnnulees().subscribe(
      (data:any) => {this.commandesAnnulees = data.data},
      (error) => console.error('Erreur lors du chargement des commandes annulées', error)
    );
  }

  loadCommandesDetails(): void {
    this.commandes.forEach(commande => {
      this.clientService.getById(commande.client_id).subscribe(
        (client:any) => {
          commande.client = client.data;
        },
        error => console.error(`Erreur lors du chargement du client ${commande.client_id}:`, error)
      );

      this.burgerService.getById(commande.burger_id).subscribe(
        (burger: any) => {
          commande.burger = burger.data;
        },
        error => console.error(`Erreur lors du chargement du burger ${commande.burger_id}:`, error)
      );
    });
  }

  loadStatistiquesJour(): void {
    this.commandeService.getStatistiquesJour().subscribe(
      (data:any) => {this.statistiquesJour = data.data
        console.log('statistiquesJour:', this.statistiquesJour)
      },
      (error) => console.error('Erreur lors du chargement des statistiques', error)
    );
  }

  loadBurgers(): void {
    this.burgerService.getAll().subscribe(
      (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.burgers = response.data;
          this.filteredBurgers = response.data;
        } else {
          console.error('Les données reçues ne sont pas dans le format attendu :', response);
          this.burgers = [];
          this.filteredBurgers = [];
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des burgers', error);
        this.burgers = [];
        this.filteredBurgers = [];
      }
    );
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.delete(id).subscribe(
        () => this.loadCommandes(),
        (error) => console.error('Erreur lors de la suppression de la commande', error)
      );
    }
  }

  changeEtat(id: number, etat: string): void {
    this.commandeService.changeEtat(id, etat).subscribe(
      () => this.loadCommandes(),
      (error) => console.error('Erreur lors du changement d\'état', error)
    );
  }

  annulerCommande(id: number): void {
    this.commandeService.annuler(id).subscribe(
      () => this.loadCommandes(),
      (error) => console.error('Erreur lors de l\'annulation de la commande', error)
    );
  }
}
