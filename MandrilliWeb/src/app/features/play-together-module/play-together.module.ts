import { ListModule } from './../../shared/list-module/list.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { PlayTogetherRoutingModule } from './play-together-routing.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayTogetherScreenComponent } from './play-together-screen/play-together-screen.component';

@NgModule({
    declarations: [PlayTogetherScreenComponent],
    imports: [
        CommonModule,
        BackButtonModule,
        ListModule,
        PlayTogetherRoutingModule,
        MatchHistoryModule,
    ],
})
export class PlayTogetherModule {}
