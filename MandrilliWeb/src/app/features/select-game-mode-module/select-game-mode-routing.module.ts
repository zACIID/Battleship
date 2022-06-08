import { GameModeScreenComponent } from './game-mode-screen/game-mode-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const select_game_mode_route: Routes = [
    {
        path: '',
        component: GameModeScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(select_game_mode_route)],
    exports: [RouterModule],
})
export class GameModeRoutingModule {}
