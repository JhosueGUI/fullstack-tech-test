import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusStep } from './bonus-step/bonus-step';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    BonusStep
  ],
  templateUrl: './registration.page.html',
  styleUrl: './registration.page.css',
})
export class RegistrationPage {
currentStep: 'bonus' | 'form' = 'bonus';
  selectedBonus: string | null = null;

  goToForm(bono: string) {
    this.selectedBonus = bono;
    this.currentStep = 'form';
  }
}
