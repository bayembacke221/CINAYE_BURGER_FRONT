import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Burger} from "../../models/burger.model";
import {BurgerService} from "../../services/burger.service";
import {ClientService} from "../../services/client.service";
import {CommandeService} from "../../services/commande.service";
import {Client} from "../../models/client.model";
import {Commande} from "../../models/commande.model";
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  burgers: Burger[] = [];
  selectedBurger: Burger | null = null;
  clientForm: FormGroup;

  constructor(
    private burgerService: BurgerService,
    private clientService: ClientService,
    private commandeService: CommandeService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      quantite: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadBurgers();
  }

  loadBurgers(): void {
    this.burgerService.getAllBurgers().subscribe(
      (burgers:any) => {
        this.burgers = burgers.data;
        console.log('Burgers chargés:', burgers.data);
      },
      (error) => console.error('Erreur lors du chargement des burgers:', error)
    );
  }

  selectBurger(burger: Burger): void {
    this.selectedBurger = burger;
    console.log('Burger sélectionné:', burger);
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.selectedBurger) {
      const clientData: Client = {
        nom: this.clientForm.get('nom')?.value,
        prenom: this.clientForm.get('prenom')?.value,
        telephone: this.clientForm.get('telephone')?.value,
        email: this.clientForm.get('email')?.value
      };

      this.clientService.storeClient(clientData).subscribe(
        (client:any) => {
          const commande: Commande = {
            client_id: client.data.id!,
            burger_id: this.selectedBurger?.id!,
            quantite: this.clientForm.get('quantite')?.value
          };

          this.commandeService.storeCommande(commande).subscribe(
            (response) => {
              console.log('Commande créée avec succès:', response);
              // Réinitialiser le formulaire et la sélection
              this.clientForm.reset();
              this.selectedBurger = null;
              // Afficher un message de succès à l'utilisateur
            },
            (error) => console.error('Erreur lors de la création de la commande:', error)
          );
        },
        (error) => console.error('Erreur lors de la création du client:', error)
      );
    }
  }
}
