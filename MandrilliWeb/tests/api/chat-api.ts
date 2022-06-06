import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChatApi } from '../../src/app/core/api/handlers/chat-api';
import { HttpClientModule } from '@angular/common/http';

beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [ChatApi]
    });
});

afterEach(() => {

});


test("Get Chat Should Return Non-Empty Response With Correct Fields",  (done) => {
    // Correct request
    const chatApi = null;
});

test("Get Chat Should Throw", () => {
    // wrong request
});

test("Delete Chat Should Not Throw", () => {
    // correct request
});

test("Delete Chat Should Throw", () => {
    // wrong request
});

test("Get Messages Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

test("Get Messages Should Throw", () => {
    // wrong request
});

test("Add Message Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

test("Add Message Should Throw", () => {
    // wrong request
});

test("Add User Should Return Non-Empty Response With Correct Fields", () => {
    // correct request
});

test("Add User Should Throw", () => {
    // wrong request
});

test("Remove User Should Not Throw", () => {
    // correct request
});

test("Remove User Should Throw", () => {
    // wrong request
});
