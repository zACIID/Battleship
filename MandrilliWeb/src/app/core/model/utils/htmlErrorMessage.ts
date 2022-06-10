/** Class that represents a generic error that should be showed to the user from a component */
export class HtmlErrorMessage{
    /** Field that indicated if an error is presented */
    error: boolean = false;
    /** Message of the erro that will be showed to the user */
    errorMessage: string = "";
    constructor(){}
}