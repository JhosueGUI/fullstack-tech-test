// frontend/src/app/services/sdk/clients.api-client.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRegisterRequest, ClientRegisterResponse } from '../../models/client.model';
import { environment } from '../../../environments/environment'; // Ajusta la ruta si es necesario
// Servicio SDK para interactuar con el endpoint de clientes
@Injectable({
  providedIn: 'root'
})
// Clase SDK para interactuar con el endpoint de clientes
export class ClientsApiClient {
  private apiUrl = `${environment.clientServiceUrl}/clients`; 
  constructor(private http: HttpClient) { }
  public registerClient(data: ClientRegisterRequest): Observable<ClientRegisterResponse> {
    return this.http.post<ClientRegisterResponse>(this.apiUrl, data);
  }
}