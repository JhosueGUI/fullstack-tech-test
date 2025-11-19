import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRegisterRequest, ClientRegisterResponse } from '../models/client.model';
import { ClientsApiClient } from './sdk/clients.api-client'; 

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // Inyecta el SDK (ClientsApiClient)
  constructor(private apiClient: ClientsApiClient) { }

  // Método de servicio que utiliza el SDK para registrar un cliente
  public attemptRegistration(data: ClientRegisterRequest): Observable<ClientRegisterResponse> {
    return this.apiClient.registerClient(data);
  }
}