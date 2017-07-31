import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { AuthService } from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { Http, Headers} from '@angular/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit {

  title:String;
  editorContent:String;
  previewContent:String;
  articleExists:boolean = false;
  articleId:String;
  thumbnailPath:String;
  token:string = localStorage.getItem('token');
  public uploader:FileUploader = new FileUploader({url:'http://localhost:3000/articles/images/thumbnail', authToken: this.token});
  public options: Object = {
    height: 300,
    placeholderText: 'Enter article body here',
    immediateAngularModelUpdate: true,
    imageUploadURL: 'http://localhost:3000/articles/images',
    imageUploadMethod: 'POST',
    events: {'froalaEditor.contentChanged': (e, editor) => {
      this.keypress();
    }}
  }

  public options2: Object = {
    height: 150,
    placeholderText: 'Enter article preview here',
    immediateAngularModelUpdate:true,
    charCounterMax: 140,
    events: {'foalaEditor.contentChanged': (e, editor) => {
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

//if the article doesn't exist, creates it, if it does exist, updates the article
  keypress(){
    if(!this.articleExists){
      this.createArticle();

      this.articleExists = true
    } else {

      this.updateArticle();
    }
  }

//submits the article for review
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
    },
    err => {
      console.log(err);
    })

  }

//creates the article in the database
  createArticle(){
    let article = {
      title: this.title,
      articleBody: this.editorContent,
      preview: this.previewContent
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/articles/create');
    return this.http.post(ep, article,{headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        this.articleId = data.articleId
      },
    err => {
      console.log(err);
    });
  }

//uploads image to the server, then saves the path to the article to thumnbnailPath variable
  uploadImage(){
    let article = {
      articleId: this.articleId
    }

    this.prepareUploader(article);
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            let r = JSON.parse(response)
            this.thumbnailPath = 'http://localhost:3000/' + r.path
            this.flashMessage.show('Thumbnail has been uploaded', {cssClass: 'alert-success', timeout: 5000})

        };
  }

//adds multipart data to file upload
  prepareUploader(data) {
  this.uploader.onBuildItemForm = (item, form) => {
  for (let key in data) {
  form.append(key, data[key])}};
  }

//updates the article in the database
  updateArticle(){
    let id = this.articleId
    let article = {
      title: this.title,
      articleBody: this.editorContent,
      preview: this.previewContent
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/articles/edit/' + id);
    return this.http.put(ep, article, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
      },
    err => {
      console.log(err);
    });
  }

  //opens a new tab with the article preview in it
  openWindow(id){
    window.open('articles/preview/' + id)
  }

}
