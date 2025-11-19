import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  // Listas estáticas
  readonly documentTypes = ['DNI', 'Carnet de extranjería'];
  readonly genders = ['Masculino', 'Femenino', 'Otro'];
  
  // Cálculo de fechas
  readonly currentYear = new Date().getFullYear();
  readonly years: number[] = Array.from({length: 100}, (_, i) => this.currentYear - 18 - i);
  readonly months: number[] = Array.from({length: 12}, (_, i) => i + 1);
  readonly days: number[] = Array.from({length: 31}, (_, i) => i + 1);

  constructor() { }

}