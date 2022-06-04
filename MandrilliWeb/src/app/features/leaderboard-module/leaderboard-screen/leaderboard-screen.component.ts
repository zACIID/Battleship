import { LeaderboardApi } from './../../../core/api/handlers/leaderboard-api';
import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard-screen',
  templateUrl: './leaderboard-screen.component.html',
  styleUrls: ['./leaderboard-screen.component.css']
})
export class LeaderboardScreenComponent implements OnInit {


  public leaders: UserOverview[] = [{
    userId: "ciaonefne",
    username: "pippos",
    elo: 324
  }];

  constructor(private leaderboardClient: LeaderboardApi) { }

  ngOnInit(): void {

    //TODO to implement the correct getLeaderboard call with all the paging stuff

  }

}
