import {NotificationScreenComponent} from './notification-screen/notification-screen.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const notification_route: Routes = [
  {
    path: '',
    component: NotificationScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(notification_route)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
