import { getRank } from './../../../core/model/user/elo-rankings';
import { UserApi } from './../../../core/api/handlers/user-api';
import { UserOverview } from './../../../core/model/user/user-overview';
import { ChatApi } from './../../../core/api/handlers/chat-api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/core/model/chat/message';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {


	public chatId: string = "";
	public friend: UserOverview = new UserOverview();

	constructor(
		private route: ActivatedRoute,
		private chatClient: ChatApi,
		private userClient: UserApi
	) { }

	ngOnInit(): void {

		this.route.params.subscribe((params => {
			this.chatId = params['id'];
		}));

		let userInSessionId: string = localStorage.getItem('id') || "";

		try{ 
			this.chatClient.getChat(this.chatId).subscribe((data) => {

				for(let user of data.users){

					if(user != userInSessionId){

						this.userClient.getUser(user).subscribe((us) => {
							this.friend = {
								userId: us.userId,
								username: us.username,
								elo: us.elo,
								rank: getRank(us.elo)
							}

						})
					}
				}
			})
		}
		catch(err){
			console.log("An error occurred while retrieving the chat: " + err);
		}

  	}



}
