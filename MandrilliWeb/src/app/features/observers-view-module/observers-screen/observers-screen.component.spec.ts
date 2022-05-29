import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObserversScreenComponent} from './observers-screen.component';

describe('ObserversScreenComponent', () => {
  let component: ObserversScreenComponent;
  let fixture: ComponentFixture<ObserversScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObserversScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObserversScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
