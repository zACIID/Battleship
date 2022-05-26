


export class MatchmakingEngine {
    // passare socket.io server?
    public constructor() {

    }

    public start() {
        // mettere un setTimeout che ogni 3 secondi chiama una funzione
        // questa funzione per ogni utente cerca di trovare una coppia,
        // scannerizzando per elo entro un certo range
        // il range è definito dal tempo che passa dall'inserimento nella queue.
        // ogni 10 secondi, se non si trova qualcuno dello stesso elo, il range si allarga.
        // quando delle coppie si formano, il match viene creato
        // e viene inviata una notifica tramite socket io ai giocatori che stanno per cominciare

    }
}
