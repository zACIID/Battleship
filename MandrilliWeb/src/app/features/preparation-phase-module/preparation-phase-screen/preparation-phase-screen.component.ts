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
    public error: string = "";
    public trigger: number = 0;

    constructor() {}

    ngOnInit(): void {}


    private isValidCoords(row: number, col: number): boolean{
        
        if (row > 9 || row < 0 || col > 9 || row < 0){
            return false;
        }
        else return true;
    }

    private parseCoord(coord: string): number{
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

            if(vertical && this.isValidCoords(startingRow+length, startingCol)){
                
                let coords: GridCoordinates[] = [];
                while(length > 0){
                    coords.push(new GridCoordinates((startingRow+length) -1, startingCol));
                    length--;
                }

                let newShip: Ship = {coordinates: coords, type: shipType};


                this.grid.ships.push(newShip);
                this.trigger++;


            }
            else this.error = shipType + " position is invalid";
        }


    }

}
