import { MatchResultsRoutingModule } from './match-results-routing.module';
import { BattleshiplogoModule } from './../../shared/battleship-logo-module/battleshiplogo.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { StatsModule } from './../../shared/stats-module/stats.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchResultScreenComponent } from './match-result-screen/match-result-screen.component';

@NgModule({
    declarations: [MatchResultScreenComponent],
    imports: [
        CommonModule,
        PlayerInfoModule,
        StatsModule,
        BackButtonModule,
        BattleshiplogoModule,
        MatchResultsRoutingModule,
    ],
})
export class MatchResultsModule {}
