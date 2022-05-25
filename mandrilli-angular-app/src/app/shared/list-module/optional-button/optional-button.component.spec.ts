import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalButtonComponent } from './optional-button.component';

describe('OptionalButtonComponent', () => {
  let component: OptionalButtonComponent;
  let fixture: ComponentFixture<OptionalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
