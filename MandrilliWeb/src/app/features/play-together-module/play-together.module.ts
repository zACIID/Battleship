import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { PlayTogetherRoutingModule } from './play-together-routing.module';
import { FriendListModule } from './../../shared/friend-list-module/friend-list.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayTogetherScreenComponent } from './play-together-screen/play-together-screen.component';

@NgModule({
    declarations: [PlayTogetherScreenComponent],
    imports: [CommonModule, BackButtonModule, FriendListModule, PlayTogetherRoutingModule, MatchHistoryModule],
})
export class PlayTogetherModule {}
