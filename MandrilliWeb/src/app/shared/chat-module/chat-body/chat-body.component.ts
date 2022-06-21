import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { Message } from '../../../core/model/chat/message';
import { ChatApi } from '../../../core/api/handlers/chat-api';
import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterViewChecked,
    OnDestroy,
} from '@angular/core';
import { ChatMessage } from '../../../../../../src/model/events/chat-message';
import { fromUnixSeconds } from '../../../core/api/utils/date';
import { ChatMessageListener } from '../../../core/events/listeners/chat-message';
import { ChatJoinedEmitter } from '../../../core/events/emitters/chat-joined';
import { ChatLeftEmitter } from '../../../core/events/emitters/chat-left';

@Component({
    selector: 'chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['./chat-body.component.css'],
})
export class ChatBodyComponent implements OnInit, OnDestroy, AfterViewChecked {
    constructor(
        private chatClient: ChatApi,
        private userIdProvider: UserIdProvider,
        private chatMessageListener: ChatMessageListener,
        private chatJoinedEmitter: ChatJoinedEmitter,
        private chatLeftEmitter: ChatLeftEmitter
    ) {}

    @Input() chatId: string = '';
    @ViewChild('messageContent') input?: ElementRef;
    @ViewChild('chatBody') private scrollContainer?: ElementRef;
    public messages: Message[] = [];
    public userId: string = '';

    private options = {
        skip: 0,
        limit: 10,
    };

    ngOnInit(): void {
        this.userId = this.userIdProvider.getUserId();
        try {
            this.chatClient
                .getMessages(this.chatId, this.options.skip, this.options.limit)
                .subscribe((data: Message[]) => {
                    // reverse because we want the latest message at the bottom
                    this.messages = data.reverse();
                    this.options.skip += this.options.limit;

                    if (this.scrollContainer) {
                        this.scrollContainer.nativeElement.scrollTop =
                            this.scrollContainer.nativeElement.scrollHeight;
                    }
                });
        } catch (err) {
            console.log('An error happened while loading the chat: ' + err);
        }

        // Add msg listener
        const refreshChat = (messageData: ChatMessage) => {
            this.messages.push({
                author: messageData.author,
                content: messageData.content,
                timestamp: fromUnixSeconds(messageData.timestamp),
            });
        };
        refreshChat.bind(this);
        this.chatMessageListener.listen(refreshChat);

        this.chatJoinedEmitter.emit({ chatId: this.chatId });
    }

    ngAfterViewChecked(): void {
        if (this.scrollContainer) {
            this.scrollContainer.nativeElement.scrollTop =
                this.scrollContainer.nativeElement.scrollHeight;
        }
    }

    public loadMore(): void {
        try {
            this.chatClient
                .getMessages(this.chatId, this.options.skip, this.options.limit)
                .subscribe((data: Message[]) => {
                    // reverse because we want the latest message at the bottom
                    this.messages = data.reverse().concat(this.messages);
                    this.options.skip = this.messages.length;
                });
        } catch (err) {
            console.log('An error while retrieving more messages: ' + err);
        }
    }

    public post_message(message: string) {
        this.chatClient
            .addMessage(this.chatId, {
                author: this.userId,
                content: message,
                timestamp: new Date(),
            })
            .subscribe();
        if (this.input) this.input.nativeElement.value = '';
    }

    ngOnDestroy() {
        this.chatMessageListener.unListen();

        this.chatLeftEmitter.emit({ chatId: this.chatId });
    }
}
