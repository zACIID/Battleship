export class GridCoordinates {
    /**
     * Row number in the closed interval [0, 9]
     */
    row: number = -1;

    /**
     * Column number in the closed interval [0, 9]
     */
    col: number = -1;

    constructor(row: number, col: number){
        this.row = row;
        this.col = col;
    }
}
