/**
 * Enumeration that defines all the possible statuses of a user
 */
export enum UserStatus {
    Offline = 'Offline',
    Online = 'Online',
    PrepPhase = 'PrepPhase',
    InGame = 'InGame',
    Spectating = 'Spectating',
}

export enum UserRoles {
    Base = 'Base',
    Moderator = 'Moderator',
    Admin = 'Admin',
}

export class User {
    public readonly userId: string;
    public readonly username: string;
    public readonly roles: string[];
    public readonly status: UserStatus;
    public readonly elo: number;

    constructor(
        userId: string = '',
        username: string = '',
        roles: UserRoles[] = [],
        status: UserStatus = UserStatus.Online,
        elo: number = 0
    ) {
        this.userId = userId;
        this.username = username;
        this.roles = roles;
        this.status = status;
        this.elo = elo;
    }
}
