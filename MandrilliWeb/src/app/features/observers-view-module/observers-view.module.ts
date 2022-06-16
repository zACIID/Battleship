import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { ObserversRoutingModule } from './observers-routing.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserversScreenComponent } from './observers-screen/observers-screen.component';

@NgModule({
    declarations: [ObserversScreenComponent],
    imports: [
        CommonModule,
        ChatModule,
        BoardModule,
        PlayerInfoModule,
        ObserversRoutingModule,
    ],
})
export class ObserversViewModule {}
