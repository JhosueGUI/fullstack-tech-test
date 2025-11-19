// src/app/features/registration/bonus-step/bonus-step.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Clase del componente BonusStep
@Component({
  selector: 'app-bonus-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bonus-step.html',
  styleUrls: ['./bonus-step.css']
})
// Clase del componente BonusStep
export class BonusStep {
  @Output() bonusSelected = new EventEmitter<string>();
  selectedBonus: string | null = null; 
  selectBonus(bono: string) {
    this.selectedBonus = bono;
  }
  confirmSelection() {
    if (this.selectedBonus) {
      this.bonusSelected.emit(this.selectedBonus);
    }
  }
}