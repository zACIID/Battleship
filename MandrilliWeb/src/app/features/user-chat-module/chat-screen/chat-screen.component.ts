import { ChatMessageListener } from './../../../core/events/listeners/chat-message';
import { ChatApi } from './../../../core/api/handlers/chat-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { ChatJoinedEmitter } from 'src/app/core/events/emitters/chat-joined';
import { ChatLeftEmitter } from 'src/app/core/events/emitters/chat-left';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat-screen',
    templateUrl: './chat-screen.component.html',
    styleUrls: ['./chat-screen.component.css'],
})
export class ChatScreenComponent implements OnInit {
    public chatId: string = '';
    public friend: string = '';

    constructor(
        private route: ActivatedRoute,
        private chatClient: ChatApi,
        private chatMessageListener: ChatMessageListener,
        private joinEmitter: ChatJoinedEmitter,
        private fleeEmitter: ChatLeftEmitter,
        private userIdProvider: UserIdProvider,
        private router: Router
    ) {}


    ngOnInit(): void {
        try {
            this.route.params.subscribe((params) => {
                this.chatId = params['id'];
            });

            this.chatClient.getChat(this.chatId).subscribe((data) => {
                let userInSessionId: string = this.userIdProvider.getUserId();
                for (let user of data.users) {
                    if (user != userInSessionId) {
                        this.friend = user;
                    }
                }
                this.joinEmitter.emit({chatId: data.chatId})
            });
        } catch (err) {
            console.log('An error occurred while retrieving the chat: ' + err);
        }

        // This is forcing the ngOnChanges() on chat-body component to refresh the message list (i hope)
        this.chatMessageListener.listen(() => {
            this.route.params.subscribe((params) => {
                this.chatId = params['id'];
            });
        });
    }

    public leaveChat(){
        this.fleeEmitter.emit({chatId: this.chatId})
        this.router.navigate(["/relationships"])
    }
}
