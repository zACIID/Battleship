import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBodyComponent } from './chat-body/chat-body.component';
import { MessageComponent } from './message/message.component';

@NgModule({
    declarations: [ChatBodyComponent, MessageComponent],
    imports: [CommonModule],
    exports: [ChatBodyComponent]
})
export class ChatModule {}
