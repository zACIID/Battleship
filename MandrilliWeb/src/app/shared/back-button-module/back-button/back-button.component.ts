import { Component, OnInit } from '@angular/core';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.css'],
})
export class BackButtonComponent implements OnInit {
    faWindowClose = faWindowClose;
    constructor() {}

    ngOnInit(): void {}
}
