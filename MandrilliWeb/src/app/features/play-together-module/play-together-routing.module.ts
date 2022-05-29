import { PlayTogetherScreenComponent } from './play-together-screen/play-together-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const play_together_route: Routes = [
    {
        path: '',
        component: PlayTogetherScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(play_together_route)],
    exports: [RouterModule],
})
export class PlayTogetherRoutingModule {}
