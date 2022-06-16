import { GameRoutingModule } from './game-routing.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { OpponentBoardComponent } from './opponent-board/opponent-board.component';

@NgModule({
    declarations: [
        GameScreenComponent,
        OpponentBoardComponent
    ],
    imports: [
        CommonModule,
        ChatModule,
        BoardModule,
        PlayerInfoModule,
        GameRoutingModule,
    ],
})
export class GameModule {}
