import { Injectable } from '@angular/core';
import { UBIGEO_PERU, UbigeoItem } from '../data/ubigeo.data'; 

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor() { }
  // Método para obtener la lista de Departamentos
  getDepartments(): UbigeoItem[] {
    return UBIGEO_PERU;
  }
// Método para obtener la lista de Provincias dado un código de Departamento
  getChildren(parentCode: string, source: UbigeoItem[]): UbigeoItem[] {
    const parentItem = source.find(item => item.code === parentCode);
    return parentItem?.children || [];
  }
}