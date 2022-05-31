import { SettingsButtonComponent } from './settings-button/settings-button.component';
import { ListModule } from '../list-module/list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySidebarComponent } from './history-sidebar/history-sidebar.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { BattleshiplogoModule } from '../battleship-logo-module/battleshiplogo.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [HistorySidebarComponent, HistoryListComponent, SettingsButtonComponent],
    imports: [CommonModule, BattleshiplogoModule, ListModule, FontAwesomeModule, RouterModule],
    exports: [HistorySidebarComponent],
})
export class MatchHistoryModule {}
