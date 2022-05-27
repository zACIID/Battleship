import { HomepageRoutingModule } from './homepage-routing.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageScreenComponent } from './homepage-screen/homepage-screen.component';
import { FeatureButtonComponent } from './feature-button/feature-button.component';
import { GameButtonComponent } from './game-button/game-button.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';
import { PlainButtonModule } from 'src/app/shared/plain-button-module/plain-button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'


@NgModule({
  declarations: [
    HomepageScreenComponent,
    FeatureButtonComponent,
    GameButtonComponent,
    ProfileButtonComponent
  ],
  imports: [
    CommonModule,
    PlainButtonModule,
    MatchHistoryModule,
    HomepageRoutingModule,
    FontAwesomeModule
  ]
})
export class HomepageModule { }
