import { PreparationPhaseRoutingModule } from './preparation-phase-routing.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { BattleshiplogoModule } from './../../shared/battleship-logo-module/battleshiplogo.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreparationPhaseScreenComponent } from './preparation-phase-screen/preparation-phase-screen.component';
import { RandomDeploymentButtonComponent } from './random-deployment-button/random-deployment-button.component';
import { BattleButtonComponent } from './battle-button/battle-button.component';



@NgModule({
  declarations: [
    PreparationPhaseScreenComponent,
    RandomDeploymentButtonComponent,
    BattleButtonComponent
  ],
  imports: [
    CommonModule,
    BackButtonModule,
    BattleshiplogoModule,
    BoardModule,
    PlayerInfoModule,
    ChatModule,
    PreparationPhaseRoutingModule
  ]
})
export class PreparationPhaseModule { }
