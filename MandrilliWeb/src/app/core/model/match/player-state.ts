import { BattleshipGrid } from './battleship-grid';

export interface PlayerState {
    /**
     * Id of the player this state is referring to
     */
    playerId: string;

    /**
     * Grid of the player
     */
    grid: BattleshipGrid;

    /**
     * True if the player has completed his positioning phase (hence is ready),
     * false otherwise
     */
    isReady: boolean;
}
