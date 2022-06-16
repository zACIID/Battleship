import { StatsOverview } from './../../../core/model/user/stats-overview';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'stats-grid',
    templateUrl: './stats-grid.component.html',
    styleUrls: ['./stats-grid.component.css'],
})
export class StatsGridComponent implements OnInit {
    @Input() stats: StatsOverview[] = [];

    constructor() {}

    ngOnInit(): void {
        
    }
}
