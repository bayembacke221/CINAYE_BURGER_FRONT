import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  protected apiUrl = environment.apiUrl;
  protected endpoint!: string;

  constructor(protected http: HttpClient) { }

  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}${this.endpoint}`,{ headers: this.getHeaders() })
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${this.endpoint}/${id}`,{ headers: this.getHeaders() });
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${this.endpoint}`, item,{ headers: this.getHeaders() });
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${this.endpoint}/${id}`, item,{ headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.endpoint}/${id}`,{ headers: this.getHeaders() });
  }
}
