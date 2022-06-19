import { Chat } from './../../../core/model/chat/chat';
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
    public trigger: number = 0;

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

                this.chatClient.getChat(this.chatId).subscribe((data: Chat) => {
                
                    let userInSessionId: string = this.userIdProvider.getUserId();
                    for (let user of data.users) {
                        if (user !== userInSessionId) {
                            this.friend = user;
                        }
                        
                    }
                    this.joinEmitter.emit({chatId: data.chatId})
                });
            });
            
        } catch (err) {
            console.log('An error occurred while retrieving the chat: ' + err);
        }
        
        const refreshChat = () => {
            this.trigger++;
        };
        refreshChat.bind(this);
        this.chatMessageListener.listen(refreshChat);
        
    }

    ngOnDestroy() : void {
        this.chatMessageListener.unListen()
    }

    public async leaveChat(){
        this.fleeEmitter.emit({chatId: this.chatId})
        await this.router.navigate(["/relationships"])
    }
}
