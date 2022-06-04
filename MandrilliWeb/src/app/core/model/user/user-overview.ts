/**
 * Interface that contains all the relevant information to show about a user, some of these field may need to link an action
 * Like userId will need to open the corresponding player info just by clicking it
 */
 export interface UserOverview {
    /**
     * Id of the user
     */
    userId: string;


    /**
     * Username of the user
     */
    username: string;


    /**
     * elo of the user
     */
    elo: number;
}