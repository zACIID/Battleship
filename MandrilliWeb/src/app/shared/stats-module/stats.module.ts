import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsGridComponent } from './stats-grid/stats-grid.component';
import { StatBlockComponent } from './stat-block/stat-block.component';



@NgModule({
  declarations: [
    StatsGridComponent,
    StatBlockComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StatsGridComponent
  ]
})
export class StatsModule { }
