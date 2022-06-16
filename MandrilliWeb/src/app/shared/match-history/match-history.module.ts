import { SettingsButtonComponent } from './settings-button/settings-button.component';
import { ListModule } from '../list-module/list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorySidebarComponent } from './history-sidebar/history-sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [HistorySidebarComponent, SettingsButtonComponent],
    imports: [CommonModule, ListModule, FontAwesomeModule, RouterModule],
    exports: [HistorySidebarComponent],
})
export class MatchHistoryModule {}
