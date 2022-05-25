import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { PlainButtonComponent } from './../../shared/plain-button-module/plain-button/plain-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageScreenComponent } from './homepage-screen/homepage-screen.component';
import { FeatureButtonComponent } from './feature-button/feature-button.component';
import { GameButtonComponent } from './game-button/game-button.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';



@NgModule({
  declarations: [
    HomepageScreenComponent,
    FeatureButtonComponent,
    GameButtonComponent,
    ProfileButtonComponent
  ],
  imports: [
    CommonModule,
    PlainButtonComponent,
    MatchHistoryModule
  ]
})
export class HomepageModule { }
