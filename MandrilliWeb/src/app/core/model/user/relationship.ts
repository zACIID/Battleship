export interface Relationship {
    /**
     * Id of some friend user
     */
    friendId: string;

    /**
     * Id of the chat with the friend
     */
    chatId: string;
}

/**
 * Interface used to identify the response of /api/users/:userId/relationships endpoint
 */
export interface RelationshipsResponse {
    relationships: Relationship[];
}
