import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stat-block',
    templateUrl: './stat-block.component.html',
    styleUrls: ['./stat-block.component.css'],
})
export class StatBlockComponent implements OnInit {
    @Input() title: string = '';
    @Input() value: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
