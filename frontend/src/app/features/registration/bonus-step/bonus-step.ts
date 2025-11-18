// src/app/features/registration/bonus-step/bonus-step.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bonus-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bonus-step.html',
  styleUrls: ['./bonus-step.css']
})
export class BonusStep {
  @Output() bonusSelected = new EventEmitter<string>();
  
  // Estado para rastrear el bono seleccionado antes de confirmar
  selectedBonus: string | null = null; 

  // Marca un bono como seleccionado (solo guarda el valor)
  selectBonus(bono: string) {
    this.selectedBonus = bono;
  }

  // Emite el evento para avanzar al siguiente paso
  confirmSelection() {
    if (this.selectedBonus) {
      this.bonusSelected.emit(this.selectedBonus);
    }
  }
}