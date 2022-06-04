import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatchHistoryModule } from './shared/match-history/match-history.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const sIoConfig: SocketIoConfig = {
    url: '',
    options: {

    }
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        // This is needed to inject an HttpClient instance
        // to the api services
        HttpClientModule,
        SocketIoModule.forRoot(sIoConfig),
        BrowserModule,
        AppRoutingModule,
        MatchHistoryModule, // TODO chiedere perché è stato messo qua -pier
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
