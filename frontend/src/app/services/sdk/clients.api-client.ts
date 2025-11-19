// frontend/src/app/services/sdk/clients.api-client.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRegisterRequest, ClientRegisterResponse } from '../../models/client.model';
import { environment } from '../../../environments/environment'; // Ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class ClientsApiClient {
  // Asegúrate de que esta URL esté configurada en src/environments/environment.ts
  private apiUrl = `${environment.clientServiceUrl}/clients`; 

  constructor(private http: HttpClient) { }

  /**
   * Método SDK: Abstrae la llamada HTTP POST al endpoint /clients.
   */
  public registerClient(data: ClientRegisterRequest): Observable<ClientRegisterResponse> {
    return this.http.post<ClientRegisterResponse>(this.apiUrl, data);
  }
}