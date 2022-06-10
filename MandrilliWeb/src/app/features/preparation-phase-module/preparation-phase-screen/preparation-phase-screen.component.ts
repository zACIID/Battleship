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
import { MatchApi } from 'src/app/core/api/handlers/match-api';
import { Match } from 'src/app/core/model/match/match';
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
        private matchClient: MatchApi
    ) {}

    ngOnInit(): void {
        try{
            this.userId = this.userIdProvider.getUserId()
            this.route.params.subscribe((param) => {
                this.matchId = param["matchId"]
            })
            this.playerStateListener.listen(this.pollingReadyRequest)
            this.playersReadyListener.listen(this.pollingFullReadyRequest)
        } catch(err){
            console.log("MORE")
        }
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

    public deploy(shipType: string, row: string, col: string, vertical: boolean): void{
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

            if(vertical && this.isValidCoords(startingRow+length, startingCol)){
                
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
                    
                }
                else{
                    this.positioningError.error = true;
                    this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
                }
            }
            else if(!vertical && this.isValidCoords(startingRow, startingCol+length)){

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
                    
                }
                else{
                    this.positioningError.error = true;
                    this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
                }
            }
            
        }
        else {
            this.positioningError.error = true;
            this.positioningError.errorMessage  =  shipType + this.positioningError.errorMessage;
        }

    }

    private decreaseCount(shipType: string): void{
        switch(shipType){
            case "Carrier": this.carrierCount--; break;
            case "Battleship": this.battleshipCount--; break;
            case "Cruiser": this.cruiserCount--; break;
            case "Destroyer": this.destroyerCount--; break;
        }

        if(this.carrierCount == 0 && this.battleshipCount == 0 && this.cruiserCount == 0 && this.destroyerCount == 0){
            this.ready = true;
        }
    }

    public reset(){
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
                this.matchClient.setReadyState(this.matchId, this.userId, true)).subscribe()
            let btn: HTMLButtonElement | null = <HTMLButtonElement> document.getElementById("ready-button")
            if (btn) btn.disabled = true
        } catch(err) {
            console.log(err)
        }
    }

    private pollingReadyRequest(data: PlayerStateChangedData) : void {
        this.opponentReady = data.isReady
        this.opponentsId = data.playerId
    }

    private pollingFullReadyRequest(data: GenericMessage) : void {
        const path: string = "/game/" + this.matchId
        this.router.navigate([path])
    }

}
