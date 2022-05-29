import { Schema, SchemaTypes, Types } from 'mongoose';

import { BattleshipGrid, BattleshipGridSchema, BattleshipGridSubDocument } from './battleship-grid';

/**
 * Interface that represents the state of a player in a battleship match
 */
export interface PlayerState {
    /**
     * Id of the player
     */
    playerId: Types.ObjectId;

    /**
     * Grid containing information about the ships and the shots received by the player
     */
    grid: BattleshipGrid;
}

/**
 * Interface that represents a player state sub-document of some match
 */
export interface PlayerStateSubDocument extends PlayerState, Types.EmbeddedDocument {
    /**
     * Grid containing information about the ships and the shots received by the player
     */
    grid: BattleshipGridSubDocument;
}

export const PlayerStateSchema = new Schema<PlayerStateSubDocument>(
    {
        playerId: {
            type: SchemaTypes.ObjectId,
            required: 'Player id is required',
        },
        grid: {
            type: BattleshipGridSchema,
            default: () => ({}),
        },
    },
    { _id: false }
);
