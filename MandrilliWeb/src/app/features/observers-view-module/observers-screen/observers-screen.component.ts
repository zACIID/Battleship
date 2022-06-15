import { ChatMessageListener } from './../../../core/events/listeners/chat-message';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { Match } from './../../../core/model/match/match';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChatJoinedEmitter } from 'src/app/core/events/emitters/chat-joined';
import { ChatMessage } from 'src/app/core/model/events/chat-message';
import { ShotFiredListener } from 'src/app/core/events/listeners/shot-fired';
import { Shot } from 'src/app/core/model/api/match/shot';
import { BattleshipGrid } from 'src/app/core/model/match/battleship-grid';
import { MatchTerminatedListener } from 'src/app/core/events/listeners/match-terminated';
import { MatchTerminatedData } from 'src/app/core/model/events/match-terminated-data';
import { MatchJoinedEmitter } from 'src/app/core/events/emitters/match-joined';
import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { ChatLeftEmitter } from 'src/app/core/events/emitters/chat-left';

@Component({
    selector: 'app-observers-screen',
    templateUrl: './observers-screen.component.html',
    styleUrls: ['./observers-screen.component.css'],
})
export class ObserversScreenComponent implements OnInit {


    public matchShowedId: string = "";
    public match?: Match;
    public chatId: string = "";
    public generalEnd: string = ""

    // TO DO serve un trigger per ogni component

    constructor(
        private route: ActivatedRoute,
        private matchClient: MatchApi,
        private chatJoinedEmitter: ChatJoinedEmitter,
        private chatLeftEmitter: ChatLeftEmitter,
        private matchJoinedEmitter: MatchJoinedEmitter,
        private matchLeftEmitter: MatchLeftEmitter,
        private chatMessageListener: ChatMessageListener,
        private playersShotListener: ShotFiredListener,
        private matchTerminatedListener: MatchTerminatedListener,
        private router: Router
    ) {}

    ngOnInit(): void {

        try{
            const matchId = this.match?.matchId || ""

            this.route.params.subscribe((params) => {
                this.matchShowedId = params['id'];
            });

            this.matchClient.getMatch(this.matchShowedId).subscribe((data) => {
                this.match = data;

                this.chatId = data.observersChat;
            })

            this.matchJoinedEmitter.emit({matchId: matchId})
            this.chatJoinedEmitter.emit({chatId: this.chatId})

            this.playersShotListener.listen(this.pollingPlayerHits)
            this.matchTerminatedListener.listen(this.pollingMatchResult)

            // It should force the chatBody component to refresh
            this.chatMessageListener.listen(
                () => { 
                    if (this.match){
                        this.chatId = this.match?.observersChat
                    }
                    else throw new Error("Observers chat id non existent");
                }
            );

        }
        catch(err){
            console.log("An error occurred while retrieving the match: " + err);
        }
    }


    public async quitView(){
        this.endScreen()
        await this.router.navigate(['/relationship']);
    }

    private pollingPlayerHits(data: Shot) : void {
        if (data.playerId !== this.match?.player1.playerId)
            this.match?.player1.grid.shotsReceived.push(data.coordinates)
        else this.match?.player2.grid.shotsReceived.push(data.coordinates)
    }

    private async pollingMatchResult(data: MatchTerminatedData) : Promise<void> {
        const matchId: string = this.match?.matchId || ""
        const path: string = "/match-results/" + matchId

        this.generalEnd = data.reason.valueOf()
        this.endScreen()

        await this.router.navigate([path])
    }

    private endScreen() {
        const matchId: string = this.match?.matchId || ""

        this.matchLeftEmitter.emit({matchId: matchId})
        this.chatLeftEmitter.emit({chatId: this.chatId})

        this.chatMessageListener.unListen()
        this.matchTerminatedListener.unListen()
        this.playersShotListener.unListen()
    }

}
