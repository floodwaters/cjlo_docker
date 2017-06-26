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
  publish_on:Date;
  unpublish_on:Date;
  highlighted:boolean;
  public options: Object = {
    height: 300,
    placeholderText: 'Enter article body here'
  }

  constructor() { }

  ngOnInit() {
  }

  articleSubmit(){
    console.log(this.editorContent)
  }

}
