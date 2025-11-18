import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonusStep } from './bonus-step/bonus-step';
import { RegisterStep } from './register-step/register-step';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule, BonusStep, RegisterStep],
  templateUrl: './registration.page.html',
  styleUrl: './registration.page.css'
})
export class RegistrationPage {

  currentStep: 'bonus' | 'form' = 'bonus';
  selectedBonus: string | null = null;

  goToForm(bono: string) {
    console.log('BONO RECIBIDO:', bono);
    this.selectedBonus = bono;
    this.currentStep = 'form';
  }
}
