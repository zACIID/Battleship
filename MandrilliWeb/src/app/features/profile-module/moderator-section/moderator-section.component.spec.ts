import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorSectionComponent } from './moderator-section.component';

describe('ModeratorSectionComponent', () => {
    let component: ModeratorSectionComponent;
    let fixture: ComponentFixture<ModeratorSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModeratorSectionComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModeratorSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
