import { AuthenticationRoutingModule } from './game-routing.module';
import { PlainButtonModule } from './../../shared/plain-button-module/plain-button.module';
import { InputFieldModule } from './../../shared/input-field-module/input-field.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { RegistrationScreenComponent } from './registration-screen/registration-screen.component';



@NgModule({
  declarations: [
    LoginScreenComponent,
    RegistrationScreenComponent
  ],
  imports: [
    CommonModule,
    InputFieldModule,
    PlainButtonModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
