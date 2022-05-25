import { PlainButtonModule } from './../plain-button-module/plain-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';



@NgModule({
  declarations: [
    BackButtonComponent
  ],
  imports: [
    CommonModule,
    PlainButtonModule
  ]
})
export class BackButtonModule { }
