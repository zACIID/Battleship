import { Overview } from '../../../core/model/user/overview';
import { Component, OnInit, Input } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'profile-button',
    templateUrl: './profile-button.component.html',
    styleUrls: ['./profile-button.component.css'],
})
export class ProfileButtonComponent implements OnInit {
    public faUser = faUser;

    @Input() public user?: Overview;

    constructor() {}

    ngOnInit(): void {}
}
