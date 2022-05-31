import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [BackButtonComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [BackButtonComponent],
})
export class BackButtonModule {}
