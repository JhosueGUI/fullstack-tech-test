// frontend/src/app/material.module.ts

import { NgModule } from '@angular/core';

// 1. Importa todos los módulos de Material necesarios
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Si lo usas para alertas/contenedores

// Agrupa los módulos para su uso interno
const MATERIAL_MODULES = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
];

@NgModule({
  // Importa y luego EXPORTA la lista de módulos de Material
  imports: [MATERIAL_MODULES],
  exports: [MATERIAL_MODULES]
})
export class MaterialModule { }