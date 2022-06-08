import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'feature-button',
    templateUrl: './feature-button.component.html',
    styleUrls: ['./feature-button.component.css'],
})
export class FeatureButtonComponent implements OnInit {


    @Input() title: string = "";
    @Input() link: string = "";
    
    constructor() {}

    ngOnInit(): void {
        this.link = "/" + this.link;
    }
}
