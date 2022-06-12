import { SocketIoModule, Socket, SocketIoConfig } from 'ngx-socket-io';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../src/environments/environment';

const sIoConfig: SocketIoConfig = {
    url: environment.apiBaseUrl,
    options: {},
};

export const injectSocketIoClient = (): Socket => {
    TestBed.configureTestingModule({
        imports: [SocketIoModule.forRoot(sIoConfig)],
        providers: [],
    });

    return TestBed.inject(Socket);
};
