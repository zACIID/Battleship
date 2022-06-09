import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameModeScreenComponent } from './game-mode-screen.component';

describe('GameModeScreenComponent', () => {
    let component: GameModeScreenComponent;
    let fixture: ComponentFixture<GameModeScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameModeScreenComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModeScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
