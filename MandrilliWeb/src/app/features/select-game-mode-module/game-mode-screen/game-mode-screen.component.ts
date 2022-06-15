import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFoundListener } from 'src/app/core/events/listeners/match-found';

@Component({
    selector: 'app-game-mode-screen',
    templateUrl: './game-mode-screen.component.html',
    styleUrls: ['./game-mode-screen.component.css'],
})
export class GameModeScreenComponent implements OnInit {
    constructor(
        private matchListener: MatchFoundListener, 
        private router: Router    
    ) {}

    ngOnInit(): void {}

    public startMatchMaking() {
        this.matchListener.listen(async (data) => {
            let reqpath = 'Observer/' + data.matchId
            await this.router.navigate([reqpath])
        })
    }
}
