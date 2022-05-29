import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PreparationPhaseScreenComponent} from './preparation-phase-screen.component';

describe('PreparationPhaseScreenComponent', () => {
  let component: PreparationPhaseScreenComponent;
  let fixture: ComponentFixture<PreparationPhaseScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreparationPhaseScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPhaseScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
