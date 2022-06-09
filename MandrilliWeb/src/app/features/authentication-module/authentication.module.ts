import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BattleshiplogoModule } from '../../shared/battleship-logo-module/battleshiplogo.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { BackButtonModule } from '../../shared/back-button-module/back-button.module';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { RegistrationScreenComponent } from './registration-screen/registration-screen.component';

@NgModule({
    declarations: [LoginScreenComponent, RegistrationScreenComponent],
    imports: [CommonModule, BackButtonModule, AuthenticationRoutingModule, BattleshiplogoModule],
})
export class AuthenticationModule {}
