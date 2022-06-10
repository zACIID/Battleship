import { BattleshipGrid } from './../../../core/model/match/battleship-grid';
import { Component, Input, OnInit, Inject    } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {

    
    @Input () state?: BattleshipGrid;
    @Input () triggerUpdate: number = 0;

    constructor(@Inject(DOCUMENT) document: Document) {}

    ngOnInit(): void {
        console.log(this.state);
        if(this.state){
            for(let ship of this.state.ships){

                for(let cell of ship.coordinates){

                    let id: string = cell.row.toString() + cell.col.toString(); 
                    
                    let square: HTMLElement | null = document.getElementById(id);
                    
                    if(square){
                        square.innerText = "X"
                    }

                }
            }

            for(let shot of this.state.shotsReceived){
                let id: string = shot.row.toString() + shot.col.toString(); 
                let square: HTMLElement | null = document.getElementById(id);
                if(square){
                    square?.classList.add("shoot")
                }
            }


        }
        else console.log("An error occurred while loading the board state");

    }


    ngOnChanges(): void{
        console.log(this.triggerUpdate);
        console.log(this.state);
        this.ngOnInit();
    }

}
