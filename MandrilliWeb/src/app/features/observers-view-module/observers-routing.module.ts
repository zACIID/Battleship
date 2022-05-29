import {ObserversScreenComponent} from './observers-screen/observers-screen.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const observers_route: Routes = [
  {
    path: '',
    component: ObserversScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(observers_route)],
  exports: [RouterModule],
})
export class ObserversRoutingModule {}
