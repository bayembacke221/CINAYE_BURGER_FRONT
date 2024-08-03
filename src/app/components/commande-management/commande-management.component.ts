import { Component, OnInit } from '@angular/core';
import { Commande } from "../../models/commande.model";
import { CommandeService } from "../../services/commande.service";
import { Client } from "../../models/client.model";
import { Burger } from "../../models/burger.model";
import { ClientService } from "../../services/client.service";
import { BurgerService } from "../../services/burger.service";
import { forkJoin } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  commandeForm: FormGroup;
  isModalOpen = false;
  isEditMode = false;
  selectedCommandeId: number | null = null;

  constructor(
    private commandeService: CommandeService,
    private clientService: ClientService,
    private burgerService: BurgerService,
    private fb: FormBuilder
  ) {
    this.commandeForm = this.fb.group({
      clientId: [''],
      clientNom: ['', Validators.required],
      clientPrenom: ['', Validators.required],
      clientTelephone: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      burgerId: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
    });
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
      (data) => this.commandesEnCours = data,
      (error) => console.error('Erreur lors du chargement des commandes en cours', error)
    );
    this.commandeService.getCommandesValidees().subscribe(
      (data) => this.commandesValidees = data,
      (error) => console.error('Erreur lors du chargement des commandes validées', error)
    );
    this.commandeService.getCommandesAnnulees().subscribe(
      (data) => this.commandesAnnulees = data,
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
      (data) => this.statistiquesJour = data,
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

  filterBurgers(event: any): void {
    if (!Array.isArray(this.burgers)) {
      console.error('this.burgers n\'est pas un tableau');
      return;
    }
    const searchTerm = event.target.value.toLowerCase();
    this.filteredBurgers = this.burgers.filter(burger =>
      burger.nom.toLowerCase().includes(searchTerm)
    );
  }

  /**
   *
   * openModal(commande?: Commande): void {
   *     this.isModalOpen = true;
   *     this.isEditMode = !!commande;
   *     this.selectedCommandeId = commande?.id || null;
   *
   *     if (commande) {
   *       this.clientService.getById(commande.client_id).subscribe(
   *         (client) => {
   *           this.commandeForm.patchValue({
   *             clientNom: client.nom,
   *             clientPrenom: client.prenom,
   *             clientTelephone: client.telephone,
   *             clientEmail: client.email,
   *             burgerId: commande.burger_id,
   *             quantite: commande.quantite,
   *           });
   *         },
   *         (error) => console.error('Erreur lors du chargement du client', error)
   *       );
   *     } else {
   *       this.commandeForm.reset({quantite: 1});
   *     }
   *   }
   *
   * */
  openModal(commande?: Commande): void {
    this.isModalOpen = true;
    this.isEditMode = !!commande;
    this.selectedCommandeId = commande?.id || null;

    if (commande) {
      this.clientService.getById(commande.client_id).subscribe(
        (client :any) => {
          this.commandeForm.patchValue({
            clientId: client.data.id,
            clientNom: client.data.nom,
            clientPrenom: client.data.prenom,
            clientTelephone: client.data.telephone,
            clientEmail: client.data.email,
            burgerId: commande.burger_id,
            quantite: commande.quantite,
          });
        },
        (error) => console.error('Erreur lors du chargement des détails de la commande', error)
      );
    } else {
      this.commandeForm.reset({quantite: 1});
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.commandeForm.reset({quantite: 1});
  }

  submitCommande(): void {
    if (this.commandeForm.valid) {
      const formData = this.commandeForm.value;
      const client: Client = {
        nom: formData.clientNom,
        prenom: formData.clientPrenom,
        telephone: formData.clientTelephone,
        email: formData.clientEmail,
      };

      const updateOrCreateCommande = (clientId: number) => {
        const commande: Commande = {
          client_id: clientId,
          burger_id: parseInt(formData.burgerId, 10),
          quantite: parseInt(formData.quantite, 10),
          etat: this.isEditMode ? undefined : 'En cours',
        };

        if (this.isEditMode && this.selectedCommandeId) {
          return this.commandeService.update(this.selectedCommandeId, commande);
        } else {
          return this.commandeService.create(commande);
        }
      };

      if (this.isEditMode) {
        // Mettez à jour le client existant
        console.log(
          'formData.clientId:', formData.clientId,
          'client:', client,
          'formData:', formData,
          'this.isEditMode:', this.isEditMode
        )
        this.clientService.update(formData.clientId, client).subscribe(
          (updatedClient: any) => {
            console.log(
              'formData.clientId:', formData.clientId
            )
            updateOrCreateCommande(formData.clientId).subscribe(
              () => {
                this.loadCommandes();
                this.closeModal();
              },
              (error) => console.error('Erreur lors de la mise à jour/création de la commande', error)
            );
          },
          (error) => console.error('Erreur lors de la mise à jour du client', error)
        );
      } else {
        // Créez un nouveau client
        this.clientService.create(client).subscribe(
          (newClient: any) => {
            if (newClient.success && newClient.data && newClient.data.id) {
              updateOrCreateCommande(newClient.data.id).subscribe(
                () => {
                  this.loadCommandes();
                  this.closeModal();
                },
                (error) => console.error('Erreur lors de la création de la commande', error)
              );
            } else {
              console.error('Réponse de création du client invalide:', newClient);
            }
          },
          (error) => console.error('Erreur lors de la création du client', error)
        );
      }
    } else {
      console.error('Formulaire invalide', this.commandeForm.errors);
    }
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
