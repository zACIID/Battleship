import { LoginInfo } from '../../../src/app/core/api/handlers/auth-api';

export interface SetupData {
    apiAuthCredentials: LoginInfo;
    insertedData: Object;
}
