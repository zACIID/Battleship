import { Schema, SchemaTypes, Types } from 'mongoose';

import {
    GridCoordinates,
    GridCoordinatesSchema,
    GridCoordinatesSubDocument,
} from './grid-coordinates';

/**
 * Enumeration that defines all the possible type of ships in the Battleship game
 */
export enum ShipTypes {
    Destroyer = 'Destroyer',
    Cruiser = 'Cruiser',
    Battleship = 'Battleship',
    Carrier = 'Carrier',
}

/**
 * Enumeration that defines the length of each type of ship.
 *
 * Can be used in conjunction with ShipTypes to get the length of
 * each type of ship.
 */
enum ShipLengths {
    Destroyer = 2,
    Cruiser = 3,
    Battleship = 4,
    Carrier = 5,
}

/**
 * Interface that represents a ship in the battleship game
 */
export interface Ship {
    /**
     * Coordinates of each cell that the ship occupies in the battleship grid.
     * The i-th coordinate corresponds to the i-th piece of the ship,
     * which means that coordinates are ordered from first piece to last.
     *
     * A ship is placed either horizontally or vertically in consecutive cells,
     * so any other combination of coordinates is invalid.
     */
    coordinates: GridCoordinates[];

    /**
     * Type of the ship
     */
    type: ShipTypes;
}

/**
 * Interface that represents a ship sub-document
 */
export interface ShipSubDocument extends Ship, Types.EmbeddedDocument {
    /**
     * Coordinates of each cell that the ship occupies in the battleship grid.
     *
     * A ship is placed either horizontally or vertically in consecutive cells,
     * so any other combination of coordinates is invalid.
     *
     *
     */
    coordinates: GridCoordinatesSubDocument[];
}

export const ShipSchema = new Schema<ShipSubDocument>({
    coordinates: {
        type: [GridCoordinatesSchema],
        required: [true, 'Ship coordinates are required'],
    },
    type: {
        type: SchemaTypes.String,
        enum: ShipTypes,
        required: [true, 'Ship type is required'],
    },
}, { _id: false });

/* Coordinates are valid if they are:
 * 1. referring to the correct number of cells, depending on ship type;
 * 2. all referring to the same row or col, since a ship is either horizontal or vertical,
 *      not diagonal;
 * 3. all referring to consecutive cells
 */
ShipSchema.pre('save', function (this: ShipSubDocument, next: Function) {
    // 1.
    if (!areCoordinatesCorrectLength(this)) {
        throw new Error(`The number of coordinates is not correct for ship type '${this.type}'`);
    }

    // 2.
    const sameRow: boolean = areCoordinatesAllSameRow(this);
    const sameCol: boolean = areCoordinatesAllSameCol(this);
    const areHorizontalOrVertical: boolean = sameRow || sameCol;
    if (!areHorizontalOrVertical) {
        throw new Error(
            'Coordinates do not refer to cells that are all placed either horizontally or vertically'
        );
    }

    // 3.
    const areConsecutive: boolean = areCoordinatesConsecutive(this);
    if (!areConsecutive) {
        throw new Error('Coordinates do not refer to consecutive cells');
    }

    next();
});

const areCoordinatesCorrectLength = function (ship: ShipSubDocument): boolean {
    // Check that coordinates are of the correct length for the ship
    const correctShipLength: number = ShipLengths[ship.type.valueOf()];

    return ship.coordinates.length === correctShipLength;
};

const areCoordinatesAllSameRow = function (ship: ShipSubDocument): boolean {
    const rows: Array<number> = ship.coordinates.map((c: GridCoordinates) => {
        return c.row;
    });

    return rows.every((value) => value === rows[0]);
};

const areCoordinatesAllSameCol = function (ship: ShipSubDocument): boolean {
    const cols: Array<number> = ship.coordinates.map((c: GridCoordinates) => {
        return c.col;
    });

    return cols.every((value) => value === cols[0]);
};

const areCoordinatesConsecutive = function (ship: ShipSubDocument): boolean {
    // If coordinates are on the same row, check that cols are consecutive,
    //  vice-versa check rows
    const sameRow: boolean = areCoordinatesAllSameRow(ship);
    let toCheckForConsecutiveness: Array<number> = null;
    if (sameRow) {
        toCheckForConsecutiveness = ship.coordinates.map((c) => c.col);
    } else {
        toCheckForConsecutiveness = ship.coordinates.map((c) => c.row);
    }

    let prevValue: number = toCheckForConsecutiveness[0];
    return toCheckForConsecutiveness.every((value, index) => {
        if (index !== 0) {
            const isConsecutive: boolean = value === prevValue - 1;
            prevValue = value;

            return isConsecutive;
        }
    });
};
