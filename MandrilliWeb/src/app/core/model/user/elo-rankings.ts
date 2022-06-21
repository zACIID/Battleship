export enum EloRankings {
    Private = 'Private',
    Sergeant = 'Sergeant',
    Chief = 'Chief',
    Lieutenant = 'Lieutenant',
    Captain = 'Captain',
    Colonel = 'Colonel',
    GeneralOfTheArmy = 'General Of The Army',
}

export const getRank = (elo: number): EloRankings => {
    if (elo < 90) return EloRankings.Private;
    else if (elo < 150) return EloRankings.Sergeant;
    else if (elo < 300) return EloRankings.Chief;
    else if (elo < 400) return EloRankings.Lieutenant;
    else if (elo < 500) return EloRankings.Captain;
    else if (elo < 600) return EloRankings.Colonel;
    else return EloRankings.GeneralOfTheArmy;
};
