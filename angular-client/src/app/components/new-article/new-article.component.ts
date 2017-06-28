import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { AuthService } from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { Http, Headers} from '@angular/http';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit {
  title:String;
  editorContent:String;
  articleExists:boolean = false;
  articleId:String;
  public options: Object = {
    height: 300,
    placeholderText: 'Enter article body here',
    immediateAngularModelUpdate: true,
    events: {'froalaEditor.contentChanged': (e, editor) => {
      this.keypress();
    }}
  }

  constructor(
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private http:Http
  ) { }

  ngOnInit() {
  }

  keypress(){
    if(!this.articleExists){
      this.createArticle();

      this.articleExists = true
    } else {

      this.updateArticle();
    }
  }

  articleSubmit(){
  let id = this.articleId
  let status = {
    status: 'review'
  }
  let headers = this.authService.setHeaders();
  let ep = this.authService.prepEndpoint('http://localhost:3000/articles/edit/status/' + id);
  return this.http.put(ep, status, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      if (data.success) {
        this.flashMessage.show('Article has been submitted', {cssClass: 'alert-success', timeout: 5000});
      }
    })

  }

  createArticle(){
    let article = {
      title: this.title,
      articleBody: this.editorContent
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/articles/create');
    return this.http.post(ep, article,{headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        this.articleId = data.articleId
      });
  }

  updateArticle(){
    let id = this.articleId
    let article = {
      title: this.title,
      articleBody: this.editorContent
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/articles/edit/' + id);
    return this.http.put(ep, article, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
      });
  }

}
