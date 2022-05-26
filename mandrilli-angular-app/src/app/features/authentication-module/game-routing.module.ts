import { RegistrationScreenComponent } from './registration-screen/registration-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const auth_routes: Routes = [
  {
    path: '/login',
    component: LoginScreenComponent
  },
  {
    path: '/register',
    component: RegistrationScreenComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(auth_routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
