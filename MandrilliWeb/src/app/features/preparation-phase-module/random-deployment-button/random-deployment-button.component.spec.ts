import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RandomDeploymentButtonComponent} from './random-deployment-button.component';

describe('RandomDeploymentButtonComponent', () => {
  let component: RandomDeploymentButtonComponent;
  let fixture: ComponentFixture<RandomDeploymentButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RandomDeploymentButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomDeploymentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
