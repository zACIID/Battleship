import { PreparationPhaseRoutingModule } from './preparation-phase-routing.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreparationPhaseScreenComponent } from './preparation-phase-screen/preparation-phase-screen.component';

@NgModule({
    declarations: [PreparationPhaseScreenComponent],
    imports: [
        CommonModule,
        BoardModule,
        PlayerInfoModule,
        ChatModule,
        PreparationPhaseRoutingModule,
    ],
})
export class PreparationPhaseModule {}
