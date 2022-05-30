import { GridCoordinates } from './coordinates';

export interface Ship {
    /**
     * Array of coordinates that represent the grid cells where the ship has been placed.
     * To the i-th coordinate corresponds the i-th cell occupied by the ship,
     * starting from its beginning
     */
    coordinates: GridCoordinates[];

    /**
     * Type of the ship.
     * Could be either Destroyer, Cruiser, Battleship or Carrier.
     */
    type: string;
}
