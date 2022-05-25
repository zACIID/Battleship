import { Schema, Types } from "mongoose";

export enum ShipTypes {

}

export interface Ship {

}

export interface ShipSubDocument extends Ship, Types.EmbeddedDocument {

}

export const ShipSchema = new Schema<ShipSubDocument>({

})

ShipSchema.methods.validateCoordinates = () => {
    xxx
}
