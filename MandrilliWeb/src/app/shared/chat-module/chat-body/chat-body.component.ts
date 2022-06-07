import { Message } from './../../../core/model/chat/message';
import { ChatApi } from './../../../core/api/handlers/chat-api';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['./chat-body.component.css'],
})
export class ChatBodyComponent implements OnInit {

    constructor(private chatClient: ChatApi) {}

    @Input() chatId: string = "";
    public messages: Message[] = [];

    private options = {
        skip: 0,
        limit: 5
    }


    ngOnInit(): void {
        this.chatClient.getMessages(this.chatId, this.options.skip, this.options.limit).subscribe(data => {
            this.messages = data;
            this.options.skip += this.options.limit;
        })

    }

    public loadMore():void {
        this.chatClient.getMessages(this.chatId, this.options.skip, this.options.limit).subscribe(data => {
            this.messages.push(...data);
            this.options.skip += this.options.limit;
        })
    }


    



}
