
import { UserApi } from './../../../core/api/handlers/user-api';
import { RelationshipOverview } from './../../../core/model/user/relationship-overview';
import { Relationship } from './../../../core/model/user/relationship';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { User } from './../../../core/model/user/user';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-friend-list-screen',
    templateUrl: './friend-list-screen.component.html',
    styleUrls: ['./friend-list-screen.component.css'],
})
export class FriendListScreenComponent implements OnInit {


    public friends: RelationshipOverview[] = [];
    public chatId: string = "";
    public friendUsername?: string;


    constructor(private relationshipsClient: RelationshipApi, private userClient: UserApi) {}


    ngOnInit(): void {
        let userId: string = localStorage.getItem('id') || "";
        
        this.relationshipsClient.getRelationships(userId).subscribe((data: Relationship[]) => {

            

            this.friends = data.map( (rel: Relationship) => {

                let usrnm: string = "";
                this.userClient.getUser(rel.friendId).subscribe((x: User) =>
                    usrnm = x.username 
                );

                return {
                    friendId: rel.friendId,
                    chatId: rel.friendId,
                    username: usrnm
                };
            })

        })

    }

    public update_chat(clickedFriendId: string): void{
        
        for(let fr of this.friends){
            if (fr.friendId === clickedFriendId)
            this.chatId = fr.chatId;
            this.friendUsername = fr.username;
        }
    }


}
