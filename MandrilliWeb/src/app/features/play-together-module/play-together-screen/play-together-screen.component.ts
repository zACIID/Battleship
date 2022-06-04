import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-play-together-screen',
    templateUrl: './play-together-screen.component.html',
    styleUrls: ['./play-together-screen.component.css'],
})
export class PlayTogetherScreenComponent implements OnInit {

    public friends: RelationshipOverview[] = [];

    constructor(private relationshipClient: RelationshipApi) {}

    ngOnInit(): void {}
}
