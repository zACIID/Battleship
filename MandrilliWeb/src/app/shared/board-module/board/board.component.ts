import { BattleshipGrid } from './../../../core/model/match/battleship-grid';
import { Component, Input, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';

@Component({
    selector: 'board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit, AfterViewInit {

    @Input() userId?: string = undefined;
    @Input() state?: BattleshipGrid;
    @Input() triggerUpdate: number = 0;
    constructor() {}

    ngOnInit(): void {
        this.ngAfterViewInit()
    }


    ngAfterViewInit(): void {
        if(this.state){

            for(let ship of this.state.ships){

                let backgroundColor: string = ""; 
                switch(ship.type){
                    case "Carrier": backgroundColor = "carrier-back-color"; break;
                    case "Battleship": backgroundColor = "battleship-back-color"; break;
                    case "Cruiser": backgroundColor = "cruiser-back-color"; break;
                    case "Destroyer": backgroundColor = "destroyer-back-color"; break;
                }
                
                for(let cell of ship.coordinates){

                    let id: string = this.userId + cell.row.toString() + cell.col.toString(); 
                    
                    let square: HTMLElement | null = document.getElementById(id);
                    
                    if(square){
                        square.classList.add(backgroundColor);
                    }

                }
            }

            for(let shot of this.state.shotsReceived){
                let id: string = this.userId + shot.row.toString() + shot.col.toString(); 
                let square: HTMLElement | null = document.getElementById(id);
                if(square){
                    square.classList.add("has-text-warning");
                    square.innerText = "X";
                }
            }
        }
    }

    ngOnChanges(): void{
        this.ngOnInit();
        

        if(this.triggerUpdate == -1){
            
            for(let i = 0; i < 10; i++){
                for(let j = 0; j < 10; j++){
                    let square: HTMLElement | null = document.getElementById(this.userId + i.toString() + j.toString());
                    if(square){
                        square.className = "";
                    }
                }
            }
        }
    }

}
