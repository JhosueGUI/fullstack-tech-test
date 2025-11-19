// frontend/src/app/services/client.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRegisterRequest, ClientRegisterResponse } from '../models/client.model';
// Importa el cliente API desde la carpeta SDK
import { ClientsApiClient } from './sdk/clients.api-client'; 

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // Inyecta el SDK (ClientsApiClient)
  constructor(private apiClient: ClientsApiClient) { }

  /**
   * Lógica de Negocio: Intenta registrar un cliente.
   * La capa de aplicación llama a este método.
   */
  public attemptRegistration(data: ClientRegisterRequest): Observable<ClientRegisterResponse> {
    // Delega la llamada a la capa SDK/API.
    return this.apiClient.registerClient(data);
  }
}