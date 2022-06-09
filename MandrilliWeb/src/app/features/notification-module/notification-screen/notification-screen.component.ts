import { MatchRequestAcceptedEmitter } from './../../../core/events/emitters/match-request-accepted';
import { UserApi } from './../../../core/api/handlers/user-api';
import { NotificationOverview } from './../../../core/model/user/notification-overview';
import { FriendRequestAcceptedEmitter } from './../../../core/events/emitters/friend-request-accepted';
import { Message } from './../../../core/model/chat/message';
import { NotificationApi } from './../../../core/api/handlers/notification-api';
import { RelationshipApi } from './../../../core/api/handlers/relationship-api';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-notification-screen',
    templateUrl: './notification-screen.component.html',
    styleUrls: ['./notification-screen.component.css'],
})
export class NotificationScreenComponent implements OnInit {

    public userId: string = ""
    public friendNotifications: NotificationOverview[] = [];
    public battleNotifications: NotificationOverview[] = [];


    // TODO resolve NullInjectorError on FriendRequestAcceptedEmitter
    constructor(
        private notificationClient: NotificationApi,
        private userClient: UserApi,
        private friendAcceptClient: FriendRequestAcceptedEmitter,
        private matchRequestAcceptedEmitter: MatchRequestAcceptedEmitter
    ) {}

    ngOnInit(): void {
        this.userId = localStorage.getItem('id') || "";

        try{
            this.notificationClient.getNotifications(this.userId).subscribe(data => {
                for(let not of data){
                    if(not.type === "FriendRequest"){


                        this.userClient.getUser(not.sender).subscribe( usr => {
                            usr.username;
                            this.friendNotifications.push({ 
                                type: not.type,
                                sender: not.sender,
                                username: usr.username
                            });
                        });
                        
                    }
                    else{

                        this.userClient.getUser(not.sender).subscribe( usr => {
                            usr.username;
                            this.battleNotifications.push({ 
                                type: not.type,
                                sender: not.sender,
                                username: usr.username
                            });
                        });

                    }
                }
            });
        }
        catch(err){

        }

    }


    public acceptFriend(friendId: string){

        this.friendAcceptClient.emit({
            userToNotifyId: friendId,
            friendId: this.userId
        })

    }

    public refuseFriend(friendId: string){
        try{
            this.notificationClient.removeNotification(this.userId, {type: "FriendRequest", sender: friendId});
        }
        catch(err){
            console.log("error removing friend notification: " + err);
        }
    }



    public acceptBattle(friendId: string){
        
        this.matchRequestAcceptedEmitter.emit({
            player1Id: this.userId,
            player2Id: friendId,
        })

    }

    public refuseBattle(friendId: string){
        
        try{
            this.notificationClient.removeNotification(this.userId, {type: "BattleRequest", sender: friendId});
        }
        catch(err){
            console.log("error removing battle notification: " + err);
        }


    }

}
