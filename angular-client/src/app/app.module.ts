import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {DropdownModule} from "ngx-dropdown";
import {Ng2PaginationModule} from 'ng2-pagination';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { FileSelectDirective } from 'ng2-file-upload';
import {DpDatePickerModule} from 'ng2-date-picker';


import {AuthService} from './services/auth.service';
import {ValidateService} from './services/validate.service';
import {GetRolesService} from './services/get-roles.service';
import {DateToStringService} from './services/date-to-string.service';


import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {AuthorGuard} from './guards/author.guard';
import {EditorGuard} from './guards/editor.guard';

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
    SafeHtmlPipe
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
    DpDatePickerModule


  ],
  providers: [AuthService, ValidateService, GetRolesService, AuthGuard, AdminGuard, AuthorGuard, EditorGuard, DateToStringService],
  bootstrap: [AppComponent]
})
export class AppModule { }
