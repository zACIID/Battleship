import { UserOverview } from './../../../core/model/user/user-overview';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
})
export class PlayerInfoComponent implements OnInit {
 
    @Input() user: UserOverview = new UserOverview();

    constructor(
        private router: Router
    ) {}

    ngOnInit(): void {}

    public show_profile(){
        let url: string = "/profile/" + this.user.userId;
        
        this.router.navigate([url]);
    }
}
