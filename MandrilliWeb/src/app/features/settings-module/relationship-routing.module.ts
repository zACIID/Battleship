import { SettingScreenComponent } from './setting-screen/setting-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const settings_route: Routes = [
  {
    path: '',
    component: SettingScreenComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(settings_route)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
