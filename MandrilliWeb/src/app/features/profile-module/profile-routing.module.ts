import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileScreenComponent} from './profile-screen/profile-screen.component';

const profile_route: Routes = [
  {
    path: '',
    component: ProfileScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(profile_route)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
