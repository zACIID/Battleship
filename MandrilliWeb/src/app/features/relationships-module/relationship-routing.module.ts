import { FriendListScreenComponent } from './friend-list-screen/friend-list-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const relationship_route: Routes = [
    {
        path: '',
        component: FriendListScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(relationship_route)],
    exports: [RouterModule],
})
export class RelationshipRoutingModule {}
