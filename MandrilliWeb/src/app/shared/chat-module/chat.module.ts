import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBodyComponent } from './chat-body/chat-body.component';
import { ForeignMessageComponent } from './foreign-message/foreign-message.component';
import { UserMessageComponent } from './user-message/user-message.component';

@NgModule({
    declarations: [ChatBodyComponent, ForeignMessageComponent, UserMessageComponent],
    imports: [CommonModule],
    exports: [ChatBodyComponent],
})
export class ChatModule {}
