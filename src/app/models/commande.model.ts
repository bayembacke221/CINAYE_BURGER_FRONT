export interface Commande {
  id?: number;
  client_id: number;
  burger_id: number;
  quantite: number;
  etat?: string;
}
