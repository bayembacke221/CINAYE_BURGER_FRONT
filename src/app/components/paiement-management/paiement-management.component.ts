import {Component, OnInit} from '@angular/core';
import {Paiement} from "../../models/paiement.model";
import {PaiementService} from "../../services/paiement.service";
import {Commande} from "../../models/commande.model";
import {Client} from "../../models/client.model";
import {Burger} from "../../models/burger.model";
import {CommandeService} from "../../services/commande.service";
import {ClientService} from "../../services/client.service";
import {BurgerService} from "../../services/burger.service";
import {catchError, forkJoin, of, throwError} from "rxjs";
type CommandeEtendue = Commande & {
  client?: Client;
  burger?: Burger;
  paiement?: Paiement;
};
@Component({
  selector: 'app-paiement-management',
  templateUrl: './paiement-management.component.html',
  styleUrl: './paiement-management.component.css'
})
export class PaiementManagementComponent  implements OnInit {
  paiements: Paiement[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  totalPaiements: number = 0;
  commandes: CommandeEtendue[] = [];
  loading = false;
  constructor(
    private paiementService: PaiementService,
    private commandeService: CommandeService,
    private clientService: ClientService,
    private burgerService: BurgerService
  ) { }

  ngOnInit(): void {
    this.loadCommandes();
    this.loadPaiements();
  }

  loadCommandes(): void {
    this.loading = true;
    this.commandeService.getCommandesValidees().subscribe(
      (response: any) => {
        const commandes = response.data;
        if (Array.isArray(commandes) && commandes.length > 0) {
          const observables = commandes.map(commande =>
            forkJoin({
              client: this.clientService.getById(commande.client_id),
              burger: this.burgerService.getById(commande.burger_id)
            })
          );

          forkJoin(observables).subscribe(
            (results: any) => {
              this.commandes = commandes.map((commande, index) => ({
                ...commande,
                client: results[index].client.data,
                burger: results[index].burger.data
              }));
              console.log(
                'Commandes chargées avec succès:',
                this.commandes
              );

              this.loading = false;
            },
            error => {
              console.error('Erreur lors du chargement des données:', error);
              this.loading = false;
            }
          );
        } else {
          console.log('Aucune commande en cours trouvée');
          this.commandes = [];
          this.loading = false;
        }
      },
      error => {
        console.error('Erreur lors du chargement des commandes:', error);
        this.loading = false;
      }
    );
  }

  effectuerPaiement(commande: CommandeEtendue): void {
    const montant = commande.quantite * (commande.burger?.prix || 0);
    const date_paiement: string = new Date().toISOString();
    this.paiementService.createPaiement(commande.id!, montant,date_paiement).subscribe(
      paiement => {
        const index = this.commandes.findIndex(c => c.id === commande.id);
        if (index !== -1) {
          this.commandes[index].paiement = paiement;
        }
      },
      error => console.error('Erreur lors de la création du paiement:', error)
    );
  }

  loadPaiements(): void {
    this.paiementService.getPaiementsByDate(this.selectedDate).subscribe(
      (data:any) => {
        this.paiements = data.data;
        this.calculateTotal();
      },
      (error) => console.error('Erreur lors du chargement des paiements:', error)
    );
  }

  calculateTotal(): void {
    this.paiementService.getTotalPaiementsByDate(this.selectedDate).subscribe(
      (response: any) => {
        // Supposons que la réponse est un objet avec une propriété 'total'
        this.totalPaiements = response.total || 0;
        // Assurez-vous que c'est bien un nombre
        this.totalPaiements = Number(this.totalPaiements);
      },
      (error) => console.error('Erreur lors du calcul du total:', error)
    );
  }

  onDateChange(): void {
    this.loadPaiements();
  }
}
