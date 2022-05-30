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
