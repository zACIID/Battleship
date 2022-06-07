import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'foreign-message',
    templateUrl: './foreign-message.component.html',
    styleUrls: ['./foreign-message.component.css'],
})
export class ForeignMessageComponent implements OnInit {

    @Input() text: string = "";

    constructor() {}

    ngOnInit(): void {}
}
