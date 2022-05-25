import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { OptionalButtonComponent } from './optional-button/optional-button.component';



@NgModule({
  declarations: [
    ListComponent,
    ListItemComponent,
    OptionalButtonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ListModuleModule { }
