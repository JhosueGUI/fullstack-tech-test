// frontend/src/app/services/sdk/security.api-client.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 

// 1. NUEVA INTERFAZ: Define la estructura del objeto 'data'
interface TokenData {
    token: string;
    // Si tu backend enviara 'expiresIn', iría aquí. Como no lo hace, lo omitimos.
}

// 2. NUEVA INTERFAZ: Define la estructura completa de la respuesta
interface ApiResponse {
    statusCode: number;
    message: string;
    data: TokenData; // Usamos la interfaz anidada
}

@Injectable({
  providedIn: 'root'
})
export class SecurityApiClient {
  private apiUrl = `${environment.securityServiceUrl}/token`; 

  constructor(private http: HttpClient) { }

  /**
   * Llama al endpoint de seguridad para generar un nuevo token de 8 dígitos.
   */
  // 3. CAMBIO: El método ahora devuelve el Observable con la interfaz ApiResponse
  public generateToken(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl); 
  }
}