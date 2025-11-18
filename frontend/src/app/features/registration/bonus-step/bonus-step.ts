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

  // Llamado al hacer click en una opción
  select(bono: string) {
    this.bonusSelected.emit(bono);
  }
}
