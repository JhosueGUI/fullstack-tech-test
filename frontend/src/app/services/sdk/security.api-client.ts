import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, TokenData } from '../../interfaces/token.interface';

//Definimos un nuevo tipo que representa la respuesta de la API para el token
type TokenApiResponse = ApiResponse<TokenData>;

// Servicio SDK para interactuar con el endpoint de seguridad
@Injectable({
    providedIn: 'root',
})
// Clase que maneja las llamadas al API de seguridad
export class SecurityApiClient {
    private apiUrl = `${environment.securityServiceUrl}/token`;
    constructor(private http: HttpClient) { }
    public generateToken(): Observable<TokenApiResponse> {
        return this.http.get<TokenApiResponse>(this.apiUrl);
    }
}
