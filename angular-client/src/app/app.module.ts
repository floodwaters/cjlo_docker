import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {DropdownModule} from "ngx-dropdown";
import {Ng2PaginationModule} from 'ng2-pagination';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { FileSelectDirective } from 'ng2-file-upload';
import {DpDatePickerModule} from 'ng2-date-picker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import {AuthService} from './services/auth.service';
import {ValidateService} from './services/validate.service';
import {GetRolesService} from './services/get-roles.service';
import {DateToStringService} from './services/date-to-string.service';
import {ShowService} from './services/show.service';
import {UserService} from './services/user.service';
import {DateTimeService} from './services/date-time.service';


import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {AuthorGuard} from './guards/author.guard';
import {EditorGuard} from './guards/editor.guard';
import {ShowAdminGuard} from './guards/show-admin.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { RegisterUsersComponent } from './components/register-users/register-users.component';
import { DashboardNavbarComponent } from './components/dashboard-navbar/dashboard-navbar.component';
import { OrderByPipe } from './order-by.pipe';
import { NewArticleComponent } from './components/new-article/new-article.component';
import { MyDraftsComponent } from './components/my-drafts/my-drafts.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { ArticleReviewComponent } from './components/article-review/article-review.component';
import { ManagePublishedComponent } from './components/manage-published/manage-published.component';
import { ManageUnpublishedComponent } from './components/manage-unpublished/manage-unpublished.component';
import { ArticlePreviewComponent } from './components/article-preview/article-preview.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NewShowComponent } from './components/new-show/new-show.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ManageShowsComponent } from './components/manage-shows/manage-shows.component';
import { EditShowComponent } from './components/edit-show/edit-show.component';


const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: 'register-users', component: RegisterUsersComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'new-article', component: NewArticleComponent, canActivate: [AuthGuard, AuthorGuard]},
  {path: 'my-drafts', component: MyDraftsComponent, canActivate: [AuthGuard, AuthorGuard]},
  {path: 'articles/edit/:id', component: EditArticleComponent, canActivate: [AuthGuard]},
  {path: 'articles/review', component: ArticleReviewComponent, canActivate: [AuthGuard, EditorGuard]},
  {path: 'articles/manage-published', component: ManagePublishedComponent, canActivate: [AuthGuard, EditorGuard]},
  {path: 'articles/manage-unpublished', component: ManageUnpublishedComponent, canActivate: [AuthGuard, EditorGuard]},
  {path: 'articles/preview/:id', component: ArticlePreviewComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent},
  {path: 'new-show', component: NewShowComponent, canActivate: [ShowAdminGuard, AuthGuard]},
  {path: 'manage-shows', component: ManageShowsComponent, canActivate: [ShowAdminGuard, AuthGuard]},
  {path: 'shows/edit/:id', component: EditShowComponent, canActivate: [AuthGuard, ShowAdminGuard]}



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
    MyDraftsComponent,
    EditArticleComponent,
    FileSelectDirective,
    ArticleReviewComponent,
    ManagePublishedComponent,
    ManageUnpublishedComponent,
    ArticlePreviewComponent,
    SafeHtmlPipe,
    NewShowComponent,
    CalendarComponent,
    ManageShowsComponent,
    EditShowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    FlashMessagesModule,
    DropdownModule,
    Ng2PaginationModule,
    DpDatePickerModule,
    MultiselectDropdownModule,
    TagInputModule,
    BrowserAnimationsModule,



  ],
  providers: [AuthService, ShowService, DateTimeService, UserService, ValidateService, GetRolesService, AuthGuard, AdminGuard, AuthorGuard, ShowAdminGuard, EditorGuard, DateToStringService],
  bootstrap: [AppComponent]
})
export class AppModule { }
