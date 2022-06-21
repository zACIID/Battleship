import { Chat } from '../../../core/model/chat/chat';
import { ChatApi } from '../../../core/api/handlers/chat-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserIdProvider } from '../../../core/api/userId-auth/userId-provider';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat-screen',
    templateUrl: './chat-screen.component.html',
    styleUrls: ['./chat-screen.component.css'],
})
export class ChatScreenComponent implements OnInit, OnDestroy {
    public chatId: string = '';
    public friend?: string = undefined;

    constructor(
        private route: ActivatedRoute,
        private chatClient: ChatApi,
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
                });
            });
        } catch (err) {
            console.log('An error occurred while retrieving the chat: ' + err);
        }
    }

    ngOnDestroy(): void {}

    public async leaveChat() {
        await this.router.navigate(['/relationships']);
    }
}
