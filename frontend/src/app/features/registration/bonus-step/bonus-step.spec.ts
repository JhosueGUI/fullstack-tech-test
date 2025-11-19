import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusStep } from './bonus-step';

describe('BonusStep', () => {
  // Declaración de variables para el componente y el fixture
  let component: BonusStep;
  let fixture: ComponentFixture<BonusStep>;
  // Configura el entorno de pruebas para el componente BonusStep
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusStep]
    })
    .compileComponents();
    fixture = TestBed.createComponent(BonusStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // Verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
