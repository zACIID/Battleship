import {Schema, SchemaTypes, Types} from 'mongoose';

/**
 * Interface that represent a stats sub-document found in a Match document.
 *
 */
export interface MatchStats {
  winner: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalShots: number;
  shipsDestroyed: number;
}

export interface MatchStatsSubDocument extends MatchStats, Types.EmbeddedDocument {}

export const MatchStatsSchema = new Schema<MatchStats>(
  {
    winner: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    startTime: {
      type: SchemaTypes.Date,
      default: () => new Date(),
    },
    endTime: {
      type: SchemaTypes.Date,
      default: null,
    },
    totalShots: {
      type: SchemaTypes.Number,
      default: 0,
    },
    shipsDestroyed: {
      type: SchemaTypes.Number,
      default: 0,
    },
  },
  {_id: false}
);
