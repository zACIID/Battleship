import { GridCoordinates } from '../../../../../../src/model/database/match/state/grid-coordinates';
import { BattleshipGrid } from './../../../core/model/match/battleship-grid';

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'opponent-board',
    templateUrl: './opponent-board.component.html',
    styleUrls: ['./opponent-board.component.css'],
})
export class OpponentBoardComponent implements OnInit {
    @Input() state: BattleshipGrid = new BattleshipGrid();
    @Input() triggerUpdate: number = 0;
    private shipsCoordinates: GridCoordinates[] = [];

    constructor() {}

    ngOnInit(): void {
        for (let ships of this.state.ships) {
            for (let coord of ships.coordinates) {
                this.shipsCoordinates.push(coord);
            }
        }

        for (let shot of this.state.shotsReceived) {
            if (
                this.shipsCoordinates.some((elem) => elem.row === shot.row && elem.col === shot.col)
            ) {
                // Detected a ship hit
                let square: HTMLElement | null = document.getElementById('s' + shot.row + shot.col);
                if (square) square.classList.add('fire');
            } else {
                // Water
                let square: HTMLElement | null = document.getElementById('s' + shot.row + shot.col);
                if (square) square.classList.add('water');
            }
        }
    }

    ngOnChanges(): void {
        this.ngOnInit();
    }
}
