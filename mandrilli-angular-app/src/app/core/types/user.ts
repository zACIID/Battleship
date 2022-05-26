import { Relationship } from './relationship';
import { UserRoles } from './../../../../../src/models/user';
import { Types } from "mongoose";
// TODO waiting for merge
//import { Notification } from './notification';

export interface User{
    userId: Types.ObjectId;
    username: string;
    roles: UserRoles[];
    online: boolean;
    notifications?: Notification[];
    relationships?: Relationship[];
    stats: {
        elo: number;
        topElo: number;
        wins: number;
        losses: number;
        shipsDestroyed: number;
        totalShots: number;
        totalHits: number;
    }
}
