import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that defines some grid coordinates
 */
export interface GridCoordinates {
    row: number;
    column: number;
}

/**
 * Interface that defines a grid coordinates sub-document
 */
export interface GridCoordinatesSubDocument extends GridCoordinates, Types.EmbeddedDocument {

}

export const GridCoordinatesSchema = new Schema<GridCoordinatesSubDocument>({
    row: {
        type: SchemaTypes.Number,
        required: "row coordinate required"
    },
    column: {
        type: SchemaTypes.Number,
        required: "column coordinate required"
    }
})
