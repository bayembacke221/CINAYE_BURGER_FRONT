import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {Commande} from "../models/commande.model";

@Injectable({
  providedIn: 'root'
})
export class CommandeService extends BaseService<Commande> {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'commandes';
  }

  changeEtat(id: number, etat: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}${this.endpoint}/${id}/change-etat`, { etat }, { headers: this.getHeaders() });
  }

  annuler(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}${this.endpoint}/${id}/annuler`, {}, { headers: this.getHeaders() });
  }

  getStatistiquesJour(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/statistiques-jour`, { headers: this.getHeaders() });
  }

  getCommandesEnCours(): Observable<any[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}${this.endpoint}/en-cours`, { headers: this.getHeaders() });
  }

  getCommandesValidees(): Observable<any[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}${this.endpoint}/validees`, { headers: this.getHeaders() });
  }

  getCommandesAnnulees(): Observable<any[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}${this.endpoint}/annulees`, { headers: this.getHeaders() });
  }

  getCommandesJournalieres(date: string): Observable<any[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}${this.endpoint}/journalieres/${date}`, { headers: this.getHeaders() });
  }

  getRecettesJournalieres(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/recettes-journalieres/${date}`, { headers: this.getHeaders() });
  }

  storeCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}${this.endpoint}/store`,
      commande);
  }
}
