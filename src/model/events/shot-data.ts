import { GridCoordinates } from '../database/match/state/grid-coordinates';

/**
 * Shot data sent with the event raised when a player fires a shot
 */
export interface ShotData {
    playerId: string;
    coordinates: GridCoordinates;
}
