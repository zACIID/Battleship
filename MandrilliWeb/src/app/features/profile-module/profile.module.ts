import { ProfileRoutingModule } from './profile-routing.module';
import { StatsModule } from './../../shared/stats-module/stats.module';
import { BackButtonModule } from './../../shared/back-button-module/back-button.module';
import { MatchHistoryModule } from './../../shared/match-history/match-history.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileScreenComponent } from './profile-screen/profile-screen.component';
import { RankOverviewComponent } from './rank-overview/rank-overview.component';
import { StatsOverviewComponent } from './stats-overview/stats-overview.component';
import { ModeratorSectionComponent } from './moderator-section/moderator-section.component';

@NgModule({
    declarations: [
        ProfileScreenComponent,
        RankOverviewComponent,
        StatsOverviewComponent,
        ModeratorSectionComponent,
    ],
    imports: [
        CommonModule,
        MatchHistoryModule,
        BackButtonModule,
        StatsModule,
        ProfileRoutingModule,
    ],
})
export class ProfileModule {}
