import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignMessageComponent } from './foreign-message.component';

describe('ForeignMessageComponent', () => {
    let component: ForeignMessageComponent;
    let fixture: ComponentFixture<ForeignMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ForeignMessageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForeignMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
