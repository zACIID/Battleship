/**
 * Class that represents an error raised when a matchmaking engine
 * is trying to be started while already running
 */
export class EngineAlreadyStartedError extends Error {
    constructor() {
        super();

        this.message = 'Matchmaking engine is already running';
    }
}

/**
 * Class that represents an error raised when a matchmaking engine
 * is trying to be stopped while already stopped
 */
export class EngineAlreadyStoppedError extends Error {
    constructor() {
        super();

        this.message = 'Matchmaking engine is already stopped';
    }
}
