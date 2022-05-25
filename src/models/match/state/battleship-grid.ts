import { Schema, Types } from 'mongoose';

import { Ship, ShipSchema, ShipSubDocument } from './ship';
import {
    GridCoordinates,
    GridCoordinatesSchema,
    GridCoordinatesSubDocument,
} from './grid-coordinates';
import { Shot } from './shot';

/**
 * Interface representing a Battleship grid.
 * Contains information about the ships placed on the grid and the
 * shots that have been fired on (received by) this grid.
 */
export interface BattleshipGrid {
    /**
     * Ships positioned on the grid.
     */
    ships: Ship[];

    /**
     * Coordinates where a shot has been fired on this grid.
     */
    shotsReceived: GridCoordinates[];
}

/**
 * Interface that represents a grid sub-document
 */
export interface BattleshipGridSubDocument extends BattleshipGrid, Types.EmbeddedDocument {
    ships: Types.DocumentArray<ShipSubDocument>;
    shotsReceived: Types.DocumentArray<GridCoordinatesSubDocument>;

    /**
     * Adds the specified shot to the grid
     * @param s shot to add
     * @return a promise containing the updated (saved) document
     */
    addShot(s: Shot): Promise<BattleshipGridSubDocument>;
}

export const BattleshipGridSchema = new Schema<BattleshipGridSubDocument>({
    ships: {
        type: [ShipSchema],
        default: [],
    },
    shotsReceived: {
        type: [GridCoordinatesSchema],
        default: [],
    },
});
