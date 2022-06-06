import { TestBed } from '@angular/core/testing';

import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthApi } from '../../src/app/core/api/handlers/auth-api';
import { AccessTokenStorage } from '../../src/app/core/api/access/access-token-storage';
import { AccessTokenProvider } from '../../src/app/core/api/access/access-token-provider';

describe("Get Chat", () => {
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ChatApi]
        });

        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {

    });

    test("Get Chat Should Return Non-Empty Response With Correct Fields", (done) => {
        const chatApi: AuthApi = new AuthApi(httpClient);
        const tokenStorage: AccessTokenStorage = new AccessTokenStorage();

        // Correct request
        const jwtObs = chatApi.login({
            username: "",
            password: ""
        });

        jwtObs.subscribe((jwt) => {


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
