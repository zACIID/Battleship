import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*   Definition of the different routes for the application, implementation with lazy-loading module
 *   A module will load only if necessary, let the application be more fast and scalable
 */
const routes: Routes = [
    {
        path: 'authentication',
        loadChildren: () =>
            import('./features/authentication-module/authentication.module').then(
                (m) => m.AuthenticationModule
            ),
    },
    {
        path: 'game/:id',
        loadChildren: () => import('./features/game-module/game.module').then((m) => m.GameModule),
    },
    {
        path: 'homepage',
        loadChildren: () =>
            import('./features/homepage-module/homepage.module').then((m) => m.HomepageModule),
    },
    {
        path: 'leaderboard',
        loadChildren: () =>
            import('./features/leaderboard-module/leaderboard.module').then(
                (m) => m.LeaderboardModule
            ),
    },
    {
        path: 'match-results/:id',
        loadChildren: () =>
            import('./features/match-results-module/match-results.module').then(
                (m) => m.MatchResultsModule
            ),
    },
    {
        path: 'notification',
        loadChildren: () =>
            import('./features/notification-module/notification.module').then(
                (m) => m.NotificationModule
            ),
    },
    {
        path: 'observers/:id',
        loadChildren: () =>
            import('./features/observers-view-module/observers-view.module').then(
                (m) => m.ObserversViewModule
            ),
    },
    {
        path: 'play-together',
        loadChildren: () =>
            import('./features/play-together-module/play-together.module').then(
                (m) => m.PlayTogetherModule
            ),
    },
    {
        path: 'preparation-phase',
        loadChildren: () =>
            import('./features/preparation-phase-module/preparation-phase.module').then(
                (m) => m.PreparationPhaseModule
            ),
    },
    {
        path: 'profile/:id',
        loadChildren: () =>
            import('./features/profile-module/profile.module').then((m) => m.ProfileModule),
    },
    {
        path: 'relationships',
        loadChildren: () =>
            import('./features/relationships-module/relationship.module').then(
                (m) => m.RelationshipModule
            ),
    },
    {
        path: 'game-mode',
        loadChildren: () =>
            import('./features/select-game-mode-module/select-game-mode.module').then(
                (m) => m.SelectGameModeModule
            ),
    },
    {
        path: 'settings',
        loadChildren: () =>
            import('./features/settings-module/settings.module').then((m) => m.SettingsModule),
    },
    {
        path: 'chat/:id',
        loadChildren: () =>
            import('./features/user-chat-module/user-chat.module').then((m) => m.UserChatModule),
    },
    {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
