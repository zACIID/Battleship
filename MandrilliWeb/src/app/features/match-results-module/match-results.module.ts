import { MatchResultsRoutingModule } from './match-results-routing.module';
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
        MatchResultsRoutingModule,
    ],
})
export class MatchResultsModule {}
