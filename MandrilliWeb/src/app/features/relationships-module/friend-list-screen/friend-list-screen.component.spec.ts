import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FriendListScreenComponent} from './friend-list-screen.component';

describe('FriendListScreenComponent', () => {
  let component: FriendListScreenComponent;
  let fixture: ComponentFixture<FriendListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendListScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
