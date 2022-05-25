import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProfileButtonComponent } from './delete-profile-button.component';

describe('DeleteProfileButtonComponent', () => {
  let component: DeleteProfileButtonComponent;
  let fixture: ComponentFixture<DeleteProfileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteProfileButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
