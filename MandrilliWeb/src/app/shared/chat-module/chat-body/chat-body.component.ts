import { Message } from './../../../core/model/chat/message';
import { ChatApi } from './../../../core/api/handlers/chat-api';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['./chat-body.component.css'],
})
export class ChatBodyComponent implements OnInit {

    constructor(
        private chatClient: ChatApi
    ) {}

    @Input() chatId: string = "";
    public messages: Message[] = [];
    public userId: string = "";


    private options = {
        skip: 0,
        limit: 5
    }


    ngOnChanges(): void{
        this.options = {skip: 0, limit: 5}

        this.ngOnInit();
    }

    ngOnInit(): void {

        this.userId = localStorage.getItem('id') || "";
        try{
            this.chatClient.getMessages(this.chatId, this.options.skip, this.options.limit).subscribe(data => {
                this.messages = data;
                this.options.skip += this.options.limit;
            })
        }
        catch(err){
            console.log("An error happened while loading the chat: " + err);
        }

    }

    public loadMore():void {
        try{
            this.chatClient.getMessages(this.chatId, this.options.skip, this.options.limit).subscribe(data => {
                this.messages.push(...data);
                this.options.skip += this.options.limit;
            })
        }
        catch(err){
            console.log("An error while retrieving more messages: " + err);
        }
    }


    public post_message(message: string){

        this.chatClient.addMessage(
            this.chatId,
            {author: this.userId, content: message, timestamp: new Date()}
        );
    }



}
