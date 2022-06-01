export interface User {
    userId: string;
    username: string;

    /**
     * List of roles assigned to the user
     */
    roles: string[];

    /**
     * Status of the user
     */
    online: boolean
}

export class CUser implements User {
    userId: string;
    username: string;

    /**
     * List of roles assigned to the user
     */
    roles: string[];

    /**
     * Status of the user
     */
    online: boolean

    constructor(userId: string = "", username: string = "", roles: string[] = [], online: boolean = false){ 
        this.userId = userId
        this.username = username
        this.roles = roles
        this.online = online
    }
}
