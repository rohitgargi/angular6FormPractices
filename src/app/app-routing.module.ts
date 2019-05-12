import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';

const appRoutes : Routes = [
  {path:"list",component:ListEmployeeComponent},
  {path:"create",component:CreateEmployeeComponent},
  {path:"",redirectTo:'/list',pathMatch:"full"},
  {path:"edit/:id",component:CreateEmployeeComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports : [RouterModule]
})
export class AppRoutingModule { }
