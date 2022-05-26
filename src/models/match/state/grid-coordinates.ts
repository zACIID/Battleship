import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that defines some grid coordinates
 */
export interface GridCoordinates {
    row: number;
    col: number;
}

/**
 * Returns true if the two provided coordinates are equal, false otherwise
 * @param a
 * @param b
 */
export const areCoordinatesEqual = (a: GridCoordinates, b: GridCoordinates): boolean => {
    return a.row === b.row && a.col === b.col;
};

/**
 * Interface that defines a grid coordinates sub-document
 */
export interface GridCoordinatesSubDocument extends GridCoordinates, Types.EmbeddedDocument {}

export const GridCoordinatesSchema = new Schema<GridCoordinatesSubDocument>(
    {
        row: {
            type: SchemaTypes.Number,
            required: 'row coordinate required',
        },
        col: {
            type: SchemaTypes.Number,
            required: 'column coordinate required',
        },
    },
    { _id: false }
);

/**
 * Grid is 10x10, which means that both row and column are a number in the closed interval [0, 9]
 */
GridCoordinatesSchema.pre('save', function (this: GridCoordinatesSubDocument, next: Function) {
    const isRowOk: boolean = 0 <= this.row && this.row <= 9;
    const isColOk: boolean = 0 <= this.col && this.col <= 9;

    if (!(isRowOk && isColOk)) {
        throw new Error('Coordinates are out of bounds');
    }

    next();
});
