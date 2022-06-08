import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameModeScreenComponent } from './game-mode-screen/game-mode-screen.component';
import { GameModeRoutingModule } from './select-game-mode-routing.module';



@NgModule({
  declarations: [
    GameModeScreenComponent
  ],
  imports: [
    CommonModule,
    GameModeRoutingModule,
    MatchHistoryModule
  ]
})
export class SelectGameModeModule { }
