import { Request } from 'express';

import { JwtData } from '../../model/api/auth/jwt-data';

/**
 * Interface that represents authenticated requests made to our api
 */
export interface AuthenticatedRequest extends Request {
    /**
     * Field inserted by jwt verification middleware.
     */
    jwtContent: JwtData;
}
