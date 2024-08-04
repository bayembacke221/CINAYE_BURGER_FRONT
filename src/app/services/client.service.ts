import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {Client} from "../models/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService<Client> {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'clients';
  }

  getClientCommandes(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/${id}/commandes`, { headers: this.getHeaders() });
  }

  storeClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}${this.endpoint}/store`, client);
  }
}
