export class User {
    userId: string;
    username: string;
    roles: string[];
    online?: boolean

    constructor(userId: string = "", username: string = "", roles: string[] = [], online: boolean = false){
        this.userId = userId
        this.username = username
        this.roles = roles
        this.online = online
    }
}
