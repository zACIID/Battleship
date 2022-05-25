import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainButtonComponent } from './plain-button.component';

describe('PlainButtonComponent', () => {
  let component: PlainButtonComponent;
  let fixture: ComponentFixture<PlainButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
