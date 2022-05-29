import {GameScreenComponent} from './game-screen/game-screen.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const game_route: Routes = [
  {
    path: '',
    component: GameScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(game_route)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
