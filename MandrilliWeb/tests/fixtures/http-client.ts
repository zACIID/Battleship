import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

export const injectHttpClient = (): HttpClient => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [],
    });

    return TestBed.inject(HttpClient);
};
