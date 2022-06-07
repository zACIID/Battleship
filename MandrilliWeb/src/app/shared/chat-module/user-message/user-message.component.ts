import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'user-message',
    templateUrl: './user-message.component.html',
    styleUrls: ['./user-message.component.css'],
})
export class UserMessageComponent implements OnInit {

    @Input() text: string = "";

    constructor() {}

    ngOnInit(): void {}
}
