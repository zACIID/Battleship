import { NotificationRoutingModule } from './notification-routing.module';
import { ListModule } from './../../shared/list-module/list.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationScreenComponent } from './notification-screen/notification-screen.component';



@NgModule({
  declarations: [
    NotificationScreenComponent
  ],
  imports: [
    CommonModule,
    BackButtonModule,
    MatchHistoryModule,
    ListModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
