import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerInfoComponent } from './player-info/player-info.component';



@NgModule({
  declarations: [
    PlayerInfoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerInfoComponent
  ]
})
export class PlayerInfoModule { }
