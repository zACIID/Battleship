import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleButtonComponent } from './battle-button.component';

describe('BattleButtonComponent', () => {
    let component: BattleButtonComponent;
    let fixture: ComponentFixture<BattleButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BattleButtonComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BattleButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
