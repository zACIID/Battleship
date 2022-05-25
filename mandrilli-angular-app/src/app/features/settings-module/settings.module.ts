import { InputFieldModule } from './../../shared/input-field-module/input-field.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingScreenComponent } from './setting-screen/setting-screen.component';
import { DarkModeSwitchComponent } from './dark-mode-switch/dark-mode-switch.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { DeleteProfileButtonComponent } from './delete-profile-button/delete-profile-button.component';



@NgModule({
  declarations: [
    
  
    SettingScreenComponent,
             DarkModeSwitchComponent,
             LogoutButtonComponent,
             DeleteProfileButtonComponent
  ],
  imports: [
    CommonModule,
    BackButtonModule,
    MatchHistoryModule,
    InputFieldModule
  ]
})
export class SettingsModule { }
