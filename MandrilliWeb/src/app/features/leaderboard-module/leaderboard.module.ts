import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardScreenComponent } from './leaderboard-screen/leaderboard-screen.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [LeaderboardScreenComponent],
    imports: [CommonModule, LeaderboardRoutingModule, MatchHistoryModule, RouterModule],
})
export class LeaderboardModule {}
