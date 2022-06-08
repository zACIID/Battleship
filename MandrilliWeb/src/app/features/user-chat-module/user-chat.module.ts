import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatModule } from '../../shared/chat-module/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';



@NgModule({
  declarations: [
    ChatScreenComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ChatModule,
    PlayerInfoModule,
    MatchHistoryModule
  ]
})
export class UserChatModule { }
