import { GridCoordinates } from "./grid-coordinates";
import { Types } from "mongoose";

export class Shot {
    public coordinates: GridCoordinates;
    public playerId: Types.ObjectId;

    public constructor(coordinates: GridCoordinates, playerId: string) {
        this.coordinates = coordinates;
        this.playerId = Types.ObjectId(playerId);
    }
}
