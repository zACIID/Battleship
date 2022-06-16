import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { RegistrationScreenComponent } from './registration-screen/registration-screen.component';

@NgModule({
    declarations: [LoginScreenComponent, RegistrationScreenComponent],
    imports: [CommonModule, AuthenticationRoutingModule],
})
export class AuthenticationModule {}
