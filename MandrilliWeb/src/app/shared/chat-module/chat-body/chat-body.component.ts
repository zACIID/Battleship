import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { Message } from './../../../core/model/chat/message';
import { ChatApi } from './../../../core/api/handlers/chat-api';
import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChange, SimpleChanges, AfterViewChecked } from '@angular/core';

@Component({
    selector: 'chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['./chat-body.component.css'],
})
export class ChatBodyComponent implements OnInit, AfterViewChecked {

    constructor(
        private chatClient: ChatApi,
        private userIdProvider: UserIdProvider
    ) {}

    @Input() chatId: string = '';
    @Input() triggerUpdate: number = 0;
    @ViewChild('messageContent') input?: ElementRef;
    @ViewChild('chatBody') private scrollContainer?: ElementRef;
    public messages: Message[] = [];
    public userId: string = '';

    private options = {
        skip: 0,
        limit: 10,
    };

    ngOnChanges(): void {
        this.options = { skip: 0, limit: 10 };
        this.ngOnInit()
    }

    ngOnInit(): void {
        this.userId = this.userIdProvider.getUserId();
        try {
            this.chatClient
                .getMessages(this.chatId, this.options.skip, this.options.limit)
                .subscribe((data) => {
                    this.messages = data;
                    this.options.skip += this.options.limit;
                    
                    if(this.scrollContainer){
                        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
                    }
                });
                
                            
        } catch (err) {
            console.log('An error happened while loading the chat: ' + err);
        }
    }

    ngAfterViewChecked(): void {
        if(this.scrollContainer){
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        }
    }

    public loadMore(): void {
        try {
            this.chatClient
                .getMessages(this.chatId, this.options.skip, this.options.limit)
                .subscribe((data) => {
                    this.messages = data.concat(this.messages);
                    this.options.skip += this.options.limit;
                });
        } catch (err) {
            console.log('An error while retrieving more messages: ' + err);
        }
    }

    public post_message(message: string) {
        
        this.chatClient.addMessage(this.chatId, {
            author: this.userId,
            content: message,
            timestamp: new Date(),
        }).subscribe();
        if (this.input) this.input.nativeElement.value = ""
    }
}
