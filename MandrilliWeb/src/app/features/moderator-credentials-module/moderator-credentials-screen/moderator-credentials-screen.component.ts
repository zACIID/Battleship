import { UserIdProvider } from './../../../core/api/userId-auth/userId-provider';
import { UserApi } from './../../../core/api/handlers/user-api';
import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/model/user/user';

@Component({
  selector: 'app-moderator-credentials-screen',
  templateUrl: './moderator-credentials-screen.component.html',
  styleUrls: ['./moderator-credentials-screen.component.css']
})
export class ModeratorCredentialsScreenComponent implements OnInit {


	public userMessage: HtmlErrorMessage = new HtmlErrorMessage();
	public userInSessionId: string = "";
	public user: User = new User();

	constructor(
		private userClient: UserApi,
		private router: Router,
		private userIdProvider: UserIdProvider
	) { }

	ngOnInit(): void {

		try{
			this.userInSessionId = this.userIdProvider.getUserId();
			this.userClient.getUser(this.userInSessionId).subscribe((data) => {
				this.user = data;
			})

		}
		catch(err){
			console.log("An error occurred while retrieving the user: " + err);
		}
	}


	public async changeCredentials(username: string, password: string) {
        
		this.userMessage.error=false;
		try{
			this.userClient.updateUsername(this.userInSessionId, username).subscribe();
			this.userClient.updatePassword(this.userInSessionId, password).subscribe();

			await this.router.navigate(['/homepage']);
		}
		catch(err: any){
			this.userMessage.error = true;
			this.userMessage.errorMessage = err;
			console.log("Error while updating moderator credentials: " + err);
		}
    }

}
