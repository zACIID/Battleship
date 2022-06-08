import { GridCoordinates } from '../match/state/grid-coordinates';

export interface Shot {
    coordinates: GridCoordinates;
    playerId: string;
}
