import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatchResultScreenComponent} from './match-result-screen.component';

describe('MatchResultScreenComponent', () => {
  let component: MatchResultScreenComponent;
  let fixture: ComponentFixture<MatchResultScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchResultScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchResultScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
