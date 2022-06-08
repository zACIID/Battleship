import { UserApi } from './../../../core/api/handlers/user-api';
import { UserStats } from './../../../core/model/user/user-stats';
import { User } from './../../../core/model/user/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stats-overview',
    templateUrl: './stats-overview.component.html',
    styleUrls: ['./stats-overview.component.css'],
})
export class StatsOverviewComponent implements OnInit {

    @Input() user: User = new User();
    
    @Input() stats: UserStats = new UserStats();

    @Input() myProfile: boolean = false;

    constructor(
        private userClient: UserApi
    ) { }

    ngOnInit(): void { }


    
}
