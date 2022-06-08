import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const chat_route: Routes = [
    {
        path: '',
        component: ChatScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(chat_route)],
    exports: [RouterModule],
})
export class ChatRoutingModule {}
