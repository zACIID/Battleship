import { HtmlErrorMessage } from './../../../core/model/utils/htmlErrorMessage';
import { GridCoordinates } from './../../../core/model/match/coordinates';
import { Ship } from './../../../core/model/match/ship';
import { BattleshipGrid } from './../../../core/model/match/battleship-grid';
import { Component, OnInit } from '@angular/core';

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

    public carrierCount: number = 1;
    public battleshipCount: number = 2;
    public cruiserCount: number = 3;
    public destroyerCount: number = 5;

    public ready: boolean = false;


    constructor() {}

    ngOnInit(): void {}


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
            case "Carrier": {
                this.carrierCount--;
                break;
            }
            case "Battleship": {
                this.battleshipCount--;
                break;
            }
            case "Cruiser": {
                this.cruiserCount--;
                break;
            }
            case "Destroyer": {
                this.destroyerCount--;
                break;
            }
        }

        if(this.carrierCount == 0 && this.battleshipCount == 0 && this.cruiserCount == 0 && this.destroyerCount == 0){
            this.ready = true;
        }
    }

    public reset(){
        this.grid = new BattleshipGrid;
        this.trigger = -1;
        this.carrierCount = 1;
        this.battleshipCount = 2;
        this.cruiserCount = 3;
        this.destroyerCount = 5;
    }

}
