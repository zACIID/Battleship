import { Relationship } from './relationship';

/**
 * Interface that contains all the relevant information to show about a relationship,
 * some of these field may need to link an action
 * Like chatId will need to open the corresponding chat just by clicking the button
 */
export interface RelationshipOverview extends Relationship {
    /**
     * Username of the friend
     */
    friendUsername: string;
}
