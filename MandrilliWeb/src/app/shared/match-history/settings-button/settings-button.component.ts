import { Component, OnInit } from '@angular/core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'settings-button',
    templateUrl: './settings-button.component.html',
    styleUrls: ['./settings-button.component.css'],
})
export class SettingsButtonComponent implements OnInit {
    faClipboard = faClipboard;

    constructor() {}

    ngOnInit(): void {}
}
