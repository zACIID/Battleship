export interface LeaderboardEntry {
    /**
     * Id of the user this entry refers to
     */
    userId: string;

    /**
     * Username of the user this entry refers to
     */
    username: string;

    /**
     * Current elo of the user this entry refers to
     */
    elo: number;
}
