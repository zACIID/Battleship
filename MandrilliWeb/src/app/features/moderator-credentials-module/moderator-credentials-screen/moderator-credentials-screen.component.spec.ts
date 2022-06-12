import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorCredentialsScreenComponent } from './moderator-credentials-screen.component';

describe('ModeratorCredentialsScreenComponent', () => {
  let component: ModeratorCredentialsScreenComponent;
  let fixture: ComponentFixture<ModeratorCredentialsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeratorCredentialsScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorCredentialsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
