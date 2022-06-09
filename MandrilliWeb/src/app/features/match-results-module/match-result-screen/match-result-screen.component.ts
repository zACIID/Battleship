import { Match } from './../../../core/model/match/match';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'match-result-screen',
    templateUrl: './match-result-screen.component.html',
    styleUrls: ['./match-result-screen.component.css'],
})
export class MatchResultScreenComponent implements OnInit {

    public matchShowedId: string = "";
    public match?: Match;
    public result: string = "";


    constructor(
        private route: ActivatedRoute,
        private matchClient: MatchApi
    ) {}

    ngOnInit(): void {


        try{

            let userId = localStorage.getItem('id') || "";

            this.route.params.subscribe((params => {
                this.matchShowedId = params['id'];
            }));

            this.matchClient.getMatch(this.matchShowedId).subscribe((data) => {
                this.match = data;
            });

            if(userId === this.match?.stats.winner){
                this.result = "VICTORY";
            }
            else this.result = "DEFEAT";

        }
        catch(err){
            console.log("An error occurred while retrieving match info")
        }

    }
}
