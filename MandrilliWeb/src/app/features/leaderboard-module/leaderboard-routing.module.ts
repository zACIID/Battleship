import { LeaderboardScreenComponent } from './leaderboard-screen/leaderboard-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'


const leaderboard_route: Routes = [
  {
      path: '',
      component: LeaderboardScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaderboard_route)],
  exports: [RouterModule],
})
export class LeaderboardRoutingModule { }
