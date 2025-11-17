import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusStep } from './bonus-step';

describe('BonusStep', () => {
  let component: BonusStep;
  let fixture: ComponentFixture<BonusStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
