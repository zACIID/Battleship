import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [PlayerInfoComponent],
    imports: [CommonModule, RouterModule],
    exports: [PlayerInfoComponent],
})
export class PlayerInfoModule {}
