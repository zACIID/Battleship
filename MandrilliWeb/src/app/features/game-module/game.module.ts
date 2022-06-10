import { GameRoutingModule } from './game-routing.module';
import { BattleshiplogoModule } from './../../shared/battleship-logo-module/battleshiplogo.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { RemainingShipComponent } from './remaining-ship/remaining-ship.component';
import { EnemyBoardComponent } from './enemy-board/enemy-board.component';

@NgModule({
    declarations: [
        GameScreenComponent,
        RemainingShipComponent,
        EnemyBoardComponent,
    ],
    imports: [
        CommonModule,
        ChatModule,
        BoardModule,
        BackButtonModule,
        PlayerInfoModule,
        BattleshiplogoModule,
        GameRoutingModule,
    ],
})
export class GameModule {}
