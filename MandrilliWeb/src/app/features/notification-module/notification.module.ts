import { FriendRequestAcceptedEmitter } from './../../core/events/emitters/friend-request-accepted';
import { NotificationRoutingModule } from './notification-routing.module';
import { ListModule } from './../../shared/list-module/list.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationScreenComponent } from './notification-screen/notification-screen.component';

@NgModule({
    declarations: [NotificationScreenComponent],
    imports: [
        CommonModule,
        MatchHistoryModule,
        ListModule,
        NotificationRoutingModule,
    ],
    providers: [FriendRequestAcceptedEmitter],
})
export class NotificationModule {}
