export interface Paiement {
  id?: number;
  commande_id: number;
  montant: number;
  date_paiement: string;
}
