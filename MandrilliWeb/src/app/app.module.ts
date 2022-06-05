import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatchHistoryModule } from './shared/match-history/match-history.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const sIoConfig: SocketIoConfig = {
    url: '', // TODO capire che url mettere
    options: {

    }
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        // This is needed to inject an HttpClient instance
        // to the api services
        HttpClientModule,

        // This is needed to inject the Socket instance
        SocketIoModule.forRoot(sIoConfig),
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
