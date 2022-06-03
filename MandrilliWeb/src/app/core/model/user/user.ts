export class User {
    userId: string;
    username: string;
    roles: string[];
    online?: boolean;

    constructor(userId: string = "", username: string = "", roles: string[] = [], online: boolean = false){
        this.userId = userId
        this.username = username
        this.roles = roles
        this.online = online
    }

    public setrank(elo: number): string {
        if (elo < 90) return "1_private"

        else if (elo < 150) return "2_sergeant"

        else if (elo < 300) return "3_chief"

        else if (elo < 400) return "4_liutenant"
        
        else if (elo < 500) return "5_captain"

        else if (elo < 600) return "6_colonel"

        else return "7_general_of_the_army"
    }
}
