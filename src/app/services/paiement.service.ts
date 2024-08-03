import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import {map, Observable} from 'rxjs';
import {Paiement} from "../models/paiement.model";

@Injectable({
  providedIn: 'root'
})
export class PaiementService extends BaseService<Paiement> {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'paiements';
  }

  createPaiement(commandeId: number, montant: number,date_paiement: string): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}${this.endpoint}`, { commande_id: commandeId, montant,date_paiement }, { headers: this.getHeaders() });
  }

  getPaiementsByDate(date: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}${this.endpoint}/date/${date}`, { headers: this.getHeaders() });
  }

  getTotalPaiementsByDate(date: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}${this.endpoint}/total-by-date/${date}`, { headers: this.getHeaders() });
  }
  getPaiementByCommandeId(commandeId: number): Observable<Paiement | null> {
    return this.http.get<Paiement[]>(`${this.apiUrl}${this.endpoint}/${commandeId}`, { headers: this.getHeaders() })
      .pipe(
        map(paiements => paiements.length > 0 ? paiements[0] : null)
      );
  }
}
