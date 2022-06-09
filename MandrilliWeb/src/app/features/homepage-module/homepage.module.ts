import { PlayerInfoModule } from './../../shared/player-info-module/player-info.module';
import { HomepageRoutingModule } from './homepage-routing.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageScreenComponent } from './homepage-screen/homepage-screen.component';
import { FeatureButtonComponent } from './feature-button/feature-button.component';
import { GameButtonComponent } from './game-button/game-button.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        HomepageScreenComponent,
        FeatureButtonComponent,
        GameButtonComponent,
        ProfileButtonComponent,
    ],
    imports: [
        CommonModule,
        MatchHistoryModule,
        HomepageRoutingModule,
        FontAwesomeModule,
        RouterModule,
        PlayerInfoModule,
    ],
})
export class HomepageModule {}
