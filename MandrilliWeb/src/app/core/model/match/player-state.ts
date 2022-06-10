import { BattleshipGrid } from './battleship-grid';

export class PlayerState {
    /**
     * Id of the player this state is referring to
     */
    playerId: string = "";

    /**
     * Grid of the player
     */
    grid: BattleshipGrid = new BattleshipGrid();

    /**
     * True if the player has completed his positioning phase (hence is ready),
     * false otherwise
     */
    isReady: boolean = false;
}
