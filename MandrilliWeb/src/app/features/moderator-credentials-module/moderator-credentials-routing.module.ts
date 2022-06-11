import { ModeratorCredentialsScreenComponent } from './moderator-credentials-screen/moderator-credentials-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const mod_cred_route: Routes = [
    {
        path: '',
        component: ModeratorCredentialsScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(mod_cred_route)],
    exports: [RouterModule],
})
export class ModeratorCredentialsRoutingModule {}
