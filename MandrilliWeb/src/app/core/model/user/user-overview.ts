import { getRank } from './elo-rankings';
/**
 * Class that contains all the relevant information to show about a user, some of these field may need to link an action
 * Like userId will need to open the corresponding player info just by clicking it
 */
export class UserOverview {
    /**
     * Id of the user
     */
    userId: string = '';

    /**
     * Username of the user
     */
    username: string = '';

    /**
     * elo of the user
     */
    elo: number = 0;

    /**
     * rank of the user, it's also used to build the source of the image which represents the rank
     */
    rank: string = '';

    constructor() {
        getRank(this.elo);
    }
}
