import { TestBed } from '@angular/core/testing';

import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthApi, LoginInfo } from '../../src/app/core/api/handlers/auth-api';
import { JwtStorage } from '../../src/app/core/api/jwt-auth/jwt-storage';
import { JwtProvider } from '../../src/app/core/api/jwt-auth/jwt-provider';
import { Jwt } from '../../src/app/core/api/handlers/auth-api';

const injectHttpClient = (): HttpClient => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: []
    });

    return TestBed.inject(HttpClient);
}

let accessToken: string;
const jwtStorageStub: JwtStorage = {
    store(token: string) {
        accessToken = token;

        console.log("[JwtStorageStub] Token set!");
    }
}

const jwtProviderStub: JwtProvider = {
    getToken(): string {
        console.log("[JwtProviderStub] Token retrieved!");

        return accessToken;
    }
}

describe("Get Chat", () => {
    let httpClient: HttpClient;
    let loginInfo: LoginInfo = {
        username: "test",
        password: ""
    }

    beforeEach((done) => {
        httpClient = injectHttpClient();

        // Registra user + login + chat
        // Fai funzione che ritorna info necessarie in modo che non devi scrivere
        // 40 volte la stessa cosa

        done();
    });

    afterEach((done) => {
        // Elimina user e chat
        // Fai funzione che dati dei parametri cancella cose

        done();
    });

    test("Get Chat Should Return Non-Empty Response With Correct Fields", (done) => {
        const authApi: AuthApi = new AuthApi(httpClient);


        // Correct request

        // TODO questo è solo un test, poi va rimosso
        const jwtObs = authApi.login(loginInfo);

        jwtObs.subscribe((jwt: Jwt) => {
            jwtStorageStub.store(jwt.token);

            done();
        })
       }
    );

    it("Get Chat Should Throw", () => {
        // wrong request
    });
});

it("Delete Chat Should Not Throw", () => {
    // correct request
});

it("Delete Chat Should Throw", () => {
    // wrong request
});

it("Get Messages Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

it("Get Messages Should Throw", () => {
    // wrong request
});

it("Add Message Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

it("Add Message Should Throw", () => {
    // wrong request
});

it("Add User Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

it("Add User Should Throw", () => {
    // wrong request
});

it("Remove User Should Not Throw", () => {
    // correct request
});

it("Remove User Should Throw", () => {
    // wrong request
});
