/**
 * Interface that represents what is contained in the data
 * segment of the JWTs issued by our api
 */
export interface JwtData {
    userId: string;
    roles: string[];
}
