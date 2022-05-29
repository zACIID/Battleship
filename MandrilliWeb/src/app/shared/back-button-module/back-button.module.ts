import {PlainButtonModule} from './../plain-button-module/plain-button.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BackButtonComponent} from './back-button/back-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [BackButtonComponent],
  imports: [CommonModule, PlainButtonModule, FontAwesomeModule],
  exports: [BackButtonComponent],
})
export class BackButtonModule {}
