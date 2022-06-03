import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { MatchHistoryModule } from './shared/match-history/match-history.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        // This is needed to inject an HttpClient instance
        // to the api services
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        MatchHistoryModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
