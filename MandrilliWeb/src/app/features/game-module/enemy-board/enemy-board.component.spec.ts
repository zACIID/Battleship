import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyBoardComponent } from './enemy-board.component';

describe('EnemyBoardComponent', () => {
    let component: EnemyBoardComponent;
    let fixture: ComponentFixture<EnemyBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnemyBoardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EnemyBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
