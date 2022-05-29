import { HomepageScreenComponent } from './homepage-screen/homepage-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const homepage_route: Routes = [
    {
        path: '',
        component: HomepageScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(homepage_route)],
    exports: [RouterModule],
})
export class HomepageRoutingModule {}
