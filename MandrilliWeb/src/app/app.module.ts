import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

const sIoConfig: SocketIoConfig = {
    url: environment.serverBaseUrl,
    options: {
        withCredentials: false,
    },
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
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
