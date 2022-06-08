export class User {
    userId: string;
    username: string;
    roles: string[];
    online: boolean;
    elo: number;

    constructor(userId: string = "", username: string = "", roles: string[] = [], online: boolean = false, elo: number = 0){
        this.userId = userId;
        this.username = username;
        this.roles = roles;
        this.online = online;
        this.elo = elo;
    }
}
