import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingShipComponent } from './remaining-ship.component';

describe('RemainingShipComponent', () => {
  let component: RemainingShipComponent;
  let fixture: ComponentFixture<RemainingShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemainingShipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
