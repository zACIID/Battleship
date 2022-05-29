import { PreparationPhaseScreenComponent } from './preparation-phase-screen/preparation-phase-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const prep_phase_route: Routes = [
    {
        path: '',
        component: PreparationPhaseScreenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(prep_phase_route)],
    exports: [RouterModule],
})
export class PreparationPhaseRoutingModule {}
