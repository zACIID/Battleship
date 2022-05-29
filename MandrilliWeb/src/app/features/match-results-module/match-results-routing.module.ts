import {MatchResultScreenComponent} from './match-result-screen/match-result-screen.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const match_results_route: Routes = [
  {
    path: '',
    component: MatchResultScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(match_results_route)],
  exports: [RouterModule],
})
export class MatchResultsRoutingModule {}
