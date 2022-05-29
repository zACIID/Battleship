import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlainButtonComponent } from './plain-button/plain-button.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
    declarations: [PlainButtonComponent, ButtonComponent],
    imports: [CommonModule],
})
export class PlainButtonModule {}
