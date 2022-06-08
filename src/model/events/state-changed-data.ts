export interface StateChangedData {
    /**
     * Id of the player that changed his state
     */
    playerId: string;

    /**
     * True if the player is now ready, false otherwise
     */
    isReady: boolean;
}
