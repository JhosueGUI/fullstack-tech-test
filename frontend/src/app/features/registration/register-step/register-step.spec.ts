import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStep } from './register-step';

describe('RegisterStep', () => {
  let component: RegisterStep;
  let fixture: ComponentFixture<RegisterStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
