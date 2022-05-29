import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayTogetherScreenComponent} from './play-together-screen.component';

describe('PlayTogetherScreenComponent', () => {
  let component: PlayTogetherScreenComponent;
  let fixture: ComponentFixture<PlayTogetherScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayTogetherScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayTogetherScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
