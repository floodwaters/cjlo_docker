import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {DropdownModule} from "ngx-dropdown";
import {Ng2PaginationModule} from 'ng2-pagination';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { DatePickerModule } from 'ng2-datepicker';

import {AuthService} from './services/auth.service';
import {ValidateService} from './services/validate.service';
import {GetRolesService} from './services/get-roles.service';


import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RegisterUsersComponent } from './components/register-users/register-users.component';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { OrderByPipe } from './order-by.pipe';
import { NewArticleComponent } from './components/new-article/new-article.component';


const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'register-users', component: RegisterUsersComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'new-article', component: NewArticleComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    ManageUsersComponent,
    RegisterUsersComponent,
    DashboardNavbarComponent,
    OrderByPipe,
    NewArticleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    FlashMessagesModule,
    DropdownModule,
    Ng2PaginationModule,
    DatePickerModule

  ],
  providers: [AuthService, ValidateService, GetRolesService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
