import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { AuthService } from '../../services/auth.service';
import {ShowService} from '../../services/show.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { Http, Headers} from '@angular/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-new-show',
  templateUrl: './new-show.component.html',
  styleUrls: ['./new-show.component.css']
})
export class NewShowComponent implements OnInit {

  name: string;
  thumbnailPath: string;
  token: string = localStorage.getItem('token');
  oneOff: boolean = false;
  public uploader:FileUploader = new FileUploader({url:'http://localhost:3000/shows/images/thumbnail', authToken: this.token});
  public options: Object = {
    height: 300,
    placeholderText: 'Enter article body here',
    immediateAngularModelUpdate: true,
    imageUploadURL: 'http://localhost:3000/shows/images',
    imageUploadMethod: 'POST',
  }


  constructor(
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private http:Http,
    private showService:ShowService
  ) { }

  ngOnInit() {
  }

}
