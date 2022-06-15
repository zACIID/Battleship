import { MatchLeftEmitter } from 'src/app/core/events/emitters/match-left';
import { MatchApi } from './../../../core/api/handlers/match-api';
import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { GridCoordinates } from './../../../core/model/match/coordinates';
import { Ship } from './../../../core/model/match/ship';
import { BattleshipGrid } from './../../../core/model/match/battleship-grid';
import { Component, OnInit } from '@angular/core';
import { PlayerStateChangedListener } from 'src/app/core/events/listeners/player-state-changed';
import { PlayerStateChangedData } from 'src/app/core/model/events/player-state-changed-data';
import { PositioningCompletedListener } from 'src/app/core/events/listeners/positioning-completed';
import { GenericMessage } from 'src/app/core/model/events/generic-message';
import { ActivatedRoute, Router } from '@angular/router';
import { UserIdProvider } from 'src/app/core/api/userId-auth/userId-provider';
import { concat } from 'rxjs/internal/observable/concat';

@Component({
    selector: 'app-preparation-phase-screen',
    templateUrl: './preparation-phase-screen.component.html',
    styleUrls: ['./preparation-phase-screen.component.css'],
})
export class PreparationPhaseScreenComponent implements OnInit {


    public opponentsId: string = "";
    public grid: BattleshipGrid = new BattleshipGrid();
    public positioningError: HtmlErrorMessage = new HtmlErrorMessage();
    public trigger: number = 0;
    public ready: boolean = false;
    public opponentReady: boolean = false;
    private userId: string = ""
    private matchId: string = ""
    public allowRandomDeploy: boolean = false;

    public carrierCount: number = 1;
    public battleshipCount: number = 2;
    public cruiserCount: number = 3;
    public destroyerCount: number = 5;


    constructor(
        private route: ActivatedRoute,
        private playerStateListener: PlayerStateChangedListener,
        private playersReadyListener: PositioningCompletedListener,
        private userIdProvider: UserIdProvider,
        private router: Router,
        private matchClient: MatchApi,
        private fleeMatchEmitter: MatchLeftEmitter,
    ) {}

    ngOnInit(): void {
        try{
            this.userId = this.userIdProvider.getUserId()
            this.route.params.subscribe((param) => {
                this.matchId = param["matchId"]
            })
            
        } catch(err){
            console.log("An error occurred while retrieving the match from the url")
        }

        const pollingReadyRequest = (data: PlayerStateChangedData) : void => {
            console.log("Player is ready");
            this.opponentReady = data.isReady
            this.opponentsId = data.playerId
        }
        pollingReadyRequest.bind(this);
        this.playerStateListener.listen(pollingReadyRequest);

        const pollingFullReadyRequest = async (data: GenericMessage) : Promise<void> => {
            const path: string = "/game/" + this.matchId
            await this.router.navigate([path]);
        }
        pollingFullReadyRequest.bind(this);
        this.playersReadyListener.listen(pollingFullReadyRequest)


    }

    ngOnDestroy() : void {
        this.playerStateListener.unListen()
        this.playersReadyListener.unListen()
    }


    private isValidCoords(row: number, col: number): boolean{
        
        if(!isNaN(row) && !isNaN(col)){
            if ((row <= 9 && row >= 0 ) && (col <= 9 && col >= 0)){

                for(let ship of this.grid.ships){
                    for(let coord of ship.coordinates)
                        if(coord.row == row && coord.col == col){
                            this.positioningError.errorMessage = " position is invalid: overlapping";
                            return false
                        }   
                }
                return true;
            }
        }
        this.positioningError.errorMessage = " position is invalid: out of bound";
        return false;
    }

    private parseCoord(coord: string): number{
        
        coord = coord.toUpperCase();
        switch(coord){
            case 'A': return 0; 
            case 'B': return 1; 
            case 'C': return 2; 
            case 'D': return 3; 
            case 'E': return 4; 
            case 'F': return 5; 
            case 'G': return 6; 
            case 'H': return 7; 
            case 'I': return 8; 
            case 'J': return 9; 
            default: return Number(coord) - 1;
        }
    }

    private randomInteger(): number{
        let min = 0;
        let max = 9;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private randomBool(): boolean{
        return Math.floor(Math.random() * (2)) == 0 ? true : false;
    }

    public randomDeploy(){

        while(! this.deploy("Carrier", this.randomInteger().toString(), this.randomInteger().toString(), this.randomBool() )){ }

        for(let i = 0; i < 2; i++){
            while(! this.deploy("Battleship", this.randomInteger().toString(), this.randomInteger().toString(), this.randomBool() )){ }
        }
        for(let i = 0; i < 3; i++){
            while(! this.deploy("Cruiser", this.randomInteger().toString(), this.randomInteger().toString(), this.randomBool() )){ }
        }
        for(let i = 0; i < 5; i++){
            while(! this.deploy("Destroyer", this.randomInteger().toString(), this.randomInteger().toString(), this.randomBool() )){ }
        }
    }


    public deploy(shipType: string, row: string, col: string, vertical: boolean): boolean{
        this.positioningError.error = false;
        let length: number = 0;
        
        switch(shipType){
            case "Carrier": length = 5; break;
            case "Battleship": length = 4; break;
            case "Cruiser": length = 3; break;
            case "Destroyer": length = 2; break;
        }

        let startingRow = this.parseCoord(row);
        let startingCol = this.parseCoord(col);
        
        if(this.isValidCoords(startingRow, startingCol)){

            let coords: GridCoordinates[] = [];

            if(vertical && this.isValidCoords(startingRow + (length-1), startingCol)){
                
                let invalidPosition = false;
                for(let i = 0; i < length; i++){
                    if( ! this.isValidCoords((startingRow + i), startingCol) ){
                        invalidPosition = true;
                    }
                }
                if(! invalidPosition){

                    for(let i = 0; i < length; i++){
                        coords.push(new GridCoordinates((startingRow + i), startingCol));
                    }

                    let newShip: Ship = {coordinates: coords, type: shipType};
                    this.grid.ships.push(newShip);
                    this.trigger++;
                    this.decreaseCount(shipType);
                    return true;
                }
                else{
                    this.positioningError.error = true;
                    this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
                    return false;
                }
            }
            else if(!vertical && this.isValidCoords(startingRow, startingCol + (length - 1))){

                let invalidPosition = false;
                for(let i = 0; i < length ; i++){
                    if( ! this.isValidCoords(startingRow, (startingCol + i)) ){
                        invalidPosition = true;
                    }
                }
                if(! invalidPosition){

                    for(let i = 0; i < length; i++){
                        coords.push(new GridCoordinates(startingRow, (startingCol + i)));
                    }

                    let newShip: Ship = {coordinates: coords, type: shipType};
                    this.grid.ships.push(newShip);
                    this.trigger++;
                    this.decreaseCount(shipType);
                    return true;
                }
                else{
                    this.positioningError.error = true;
                    this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
                    return false;
                }
            }
        }
        
        this.positioningError.error = true;
        this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
        return false;
        

    }

    private decreaseCount(shipType: string): void{
        switch(shipType){
            case "Carrier": this.carrierCount--; break;
            case "Battleship": this.battleshipCount--; break;
            case "Cruiser": this.cruiserCount--; break;
            case "Destroyer": this.destroyerCount--; break;
        }

        this.allowRandomDeploy=true;
        if(this.carrierCount == 0 && this.battleshipCount == 0 && this.cruiserCount == 0 && this.destroyerCount == 0){
            this.ready = true;
        }
    }

    public reset(){
        this.allowRandomDeploy = false;
        this.grid = new BattleshipGrid;
        this.ready = false;
        this.trigger = -1;
        this.carrierCount = 1;
        this.battleshipCount = 2;
        this.cruiserCount = 3;
        this.destroyerCount = 5;
    }

    public beReady() {
        try {
            concat(this.matchClient.updatePlayerGrid(this.matchId, this.userId, this.grid),
                this.matchClient.setReadyState(this.matchId, this.userId, true)).subscribe();

            // Disabling battle button
            let battleBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById("ready-button");
            if (battleBtn) battleBtn.disabled = true;

            // Disabling random deployment button
            let randomBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById("random-deploy-button");
            if (randomBtn) randomBtn.disabled = true;

            // Disabling reset button
            let resetBtn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById("reset-button");
            if (resetBtn) resetBtn.disabled = true;

            this.positioningError.error = true;
            this.positioningError.errorMessage = "Match is starting soon ...";

        } catch(err) {
            console.log("An error occurred while starting the match: " + err);
        }
    }


    public async leaveMatch() {
        if (this.matchId) this.fleeMatchEmitter.emit({ matchId: this.matchId });
        else throw new Error('Error while leaving the match');
        await this.router.navigate(["/homepage"]);
    }

}
