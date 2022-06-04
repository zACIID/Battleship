import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { ListModule } from './../../shared/list-module/list.module';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardScreenComponent } from './leaderboard-screen/leaderboard-screen.component';



@NgModule({
  declarations: [
    LeaderboardScreenComponent
  ],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    ListModule,
    MatchHistoryModule
  ]
})
export class LeaderboardModule { }
