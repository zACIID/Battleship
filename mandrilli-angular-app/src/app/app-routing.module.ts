import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./features/profile-module/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./features/game-module/game.module').then(m => m.GameModule)
  },
  {
    path: 'matchresults',
    loadChildren: () => import('./features/match-results-module/match-results.module').then(m => m.MatchResultsModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
