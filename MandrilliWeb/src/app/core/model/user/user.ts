export class User {
    public readonly userId: string;
    public readonly username: string;
    public readonly roles: string[];
    public readonly online: boolean;
    public readonly elo: number;

    constructor(
        userId: string = '',
        username: string = '',
        roles: string[] = [],
        online: boolean = false,
        elo: number = 0
    ) {
        this.userId = userId;
        this.username = username;
        this.roles = roles;
        this.online = online;
        this.elo = elo;
    }
}
