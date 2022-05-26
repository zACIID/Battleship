import { ObserversRoutingModule } from './observers-routing.module';
import { BoardModule } from './../../shared/board-module/board.module';
import { ChatModule } from './../../shared/chat-module/chat.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { BattleshiplogoModule } from './../../shared/battleship-logo-module/battleshiplogo.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserversScreenComponent } from './observers-screen/observers-screen.component';



@NgModule({
  declarations: [
    ObserversScreenComponent
  ],
  imports: [
    CommonModule,
    BattleshiplogoModule,
    BackButtonModule,
    ChatModule,
    BoardModule,
    ObserversRoutingModule
  ]
})
export class ObserversViewModule { }
