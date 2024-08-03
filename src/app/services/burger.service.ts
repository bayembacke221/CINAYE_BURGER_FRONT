import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseService} from "./base.service";
import {Burger} from "../models/burger.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BurgerService extends BaseService<Burger> {
  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'burgers';
  }

  archive(id: number): Observable<Burger> {
    return this.http.put<Burger>(`${this.apiUrl}${this.endpoint}/${id}/archive`, {},{ headers: this.getHeaders() });
  }
}
