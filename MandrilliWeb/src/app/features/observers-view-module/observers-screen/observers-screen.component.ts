import { ChatMessageListener } from './../../../core/events/listeners/chat-message';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { Match } from './../../../core/model/match/match';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-observers-screen',
    templateUrl: './observers-screen.component.html',
    styleUrls: ['./observers-screen.component.css'],
})
export class ObserversScreenComponent implements OnInit {


    public matchShowedId: string = "";
    public match?: Match;
    public chatId: string = "";

    constructor(
        private route: ActivatedRoute,
        private matchClient: MatchApi,
        private chatMessageListener: ChatMessageListener,
        private router: Router
    ) {}

    ngOnInit(): void {

        try{
            this.route.params.subscribe((params) => {
                this.matchShowedId = params['id'];
            });

            this.matchClient.getMatch(this.matchShowedId).subscribe((data) => {
                this.match = data;

                this.chatId = data.observersChat;
            })



            /*   TODO 
             *   Emit nella chat appena joinata ?  
             *   E' l'emit che aggiunge lo user alla chat ?  
             */ 


            // It should force the chatBody component to refresh
            this.chatMessageListener.listen(
                () => { 
                    if (this.match){
                        this.chatId = this.match?.observersChat
                    }
                    else throw new Error("Observers chat id non existent");
                });


        }
        catch(err){
            console.log("An error occurred while retrieving the match: " + err);
        }
    }


    public async quitView(){

        /*  TODO 
         *  add logic here
         *  we should remove the user from the chat
         *  we should also unlisten the chat-message event 
         */ 
        
        await this.router.navigate(['/relationship']);
    }

    
}
