import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
})
export class PlayerInfoComponent implements OnInit {
 
    @Input() user: UserOverview = new UserOverview();

    constructor() {}

    ngOnInit(): void {}
}
