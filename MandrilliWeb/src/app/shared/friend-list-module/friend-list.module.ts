import { ListModule } from './../list-module/list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendListComponent } from './friend-list/friend-list.component';

@NgModule({
    declarations: [FriendListComponent],
    imports: [CommonModule, ListModule],
    exports: [FriendListComponent]
})
export class FriendListModule {}
