import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeratorCredentialsScreenComponent } from './moderator-credentials-screen/moderator-credentials-screen.component';
import { ModeratorCredentialsRoutingModule } from './moderator-credentials-routing.module';



@NgModule({
  declarations: [
    ModeratorCredentialsScreenComponent
  ],
  imports: [
    CommonModule,
    ModeratorCredentialsRoutingModule
  ]
})
export class ModeratorCredentialsModule { }
