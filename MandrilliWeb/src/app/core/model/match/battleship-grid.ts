import { Ship } from './ship';
import { GridCoordinates } from './coordinates';

export interface BattleshipGrid {
    /**
     * Array of ship resources that represents the ships
     * placed by the player on his grid
     */
    ships: Ship[];

    /**
     *  Array of coordinates that represents the shots
     *  received by the player on his grid
     */
    shotsReceived: GridCoordinates[]
}
