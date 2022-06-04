import { ListModule } from './../../shared/list-module/list.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { RelationshipRoutingModule } from './relationship-routing.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendListScreenComponent } from './friend-list-screen/friend-list-screen.component';

@NgModule({
    declarations: [FriendListScreenComponent],
    imports: [
        CommonModule,
        BackButtonModule,
        ChatModule,
        ListModule,
        RelationshipRoutingModule,
        MatchHistoryModule,
    ],
})
export class RelationshipModule {}
