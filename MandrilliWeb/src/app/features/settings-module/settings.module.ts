import { SettingsRoutingModule } from './relationship-routing.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingScreenComponent } from './setting-screen/setting-screen.component';

@NgModule({
    declarations: [
        SettingScreenComponent
    ],
    imports: [
        CommonModule,
        BackButtonModule,
        MatchHistoryModule,
        SettingsRoutingModule,
    ],
})
export class SettingsModule {}
