import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ShowService } from '../../services/show.service';
import { UserService } from '../../services/user.service';
import { DateTimeService } from '../../services/date-time.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { Http, Headers} from '@angular/http';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;



@Component({
  selector: 'app-edit-show',
  templateUrl: './edit-show.component.html',
  styleUrls: ['./edit-show.component.css']
})
export class EditShowComponent implements OnInit {

  public myForm: FormGroup;
  descriptionContent:any;
  show:any;
  id:number;
  thumbnailPath:string;
  tPath:string;
  bannerPath:string;
  bPath:string;
  djs:any;
  timeSlots: IMultiSelectOption[];
  days: IMultiSelectOption[];
  types: Array<string> = ['Weekly', 'Bi-weekly', 'One-off'];
  durations: Array<string> = ['1/2 hr', '1 hr', '2 hr', '3 hr'];
  token: string = localStorage.getItem('token');
  public uploader1:FileUploader = new FileUploader({url:'http://localhost:3000/shows/images/thumbnail', authToken: this.token});
  public uploader2:FileUploader = new FileUploader({url:'http://localhost:3000/shows/images/show-banner', authToken: this.token});

  public options: Object = {
    height: 300,
    placeholderText: 'Enter show description here',
    immediateAngularModelUpdate: true,
  }


  constructor(
    private _fb:FormBuilder,
    private authService:AuthService,
    private showService:ShowService,
    private flashMessage: FlashMessagesService,
    private route:ActivatedRoute,
    private userService:UserService,
    private dateTime:DateTimeService,
    private http:Http,
    private router:Router

  ) { }

  ngOnInit() {

    this.timeSlots = this.dateTime.makeIntoObjects(this.dateTime.times)
    this.days = this.dateTime.makeIntoObjects(this.dateTime.days)


    this.id = this.route.snapshot.params['id'];

    this.showService.getShowById(this.id).subscribe(data => {
      this.show = data;
      if(data.thumbnailPath){
        this.thumbnailPath = 'http://localhost:3000/' + data.thumbnailPath;
        this.tPath = data.thumbnailPath;
      }
      if(data.bannerPath){
        this.bannerPath = 'http://localhost:3000/' + data.bannerPath;
        this.bPath = data.bannerPath;
      }
      this.descriptionContent = data.description
      this.fillInData(this.show);
    },
    err => {
      console.log(err)
      return false
    })

    this.userService.getUsersByRole('dj')
      .subscribe(data => {
        this.djs = data;
      })


    //initializes the reactive form
    this.myForm = this._fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      djs: this._fb.array([this.initDj()]),
      days: [[]],
      time: ['', [Validators.required]],
      timeSlots: [[], [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      tags: [[]],
      placeholder: [false, [Validators.required]]

    });



  }

  //adds a dj to the array of djs
  initDj(){
    return this._fb.group({
      _id : []
    });
  }

  //adds a dj to the form array
  addDj() {
    const control = <FormArray>this.myForm.controls['djs'];
    control.push(this.initDj());
  }

  //removes a dj from the array
  removeDj(i: number) {
      const control = <FormArray>this.myForm.controls['djs'];
      control.removeAt(i);
  }

  fillInData(show){
    var dJs = show.djs;
    var ef = this.myForm;

    ef.patchValue({
      name: show.name,
      type: show.type,
      duration: show.duration,
      days: show.days,
      time: show.timeString,
      timeSlots: show.timeslots,
      placeholder: show.placeholder,
      startDate: moment(show.startDate),
      endDate: moment(show.endDate),

    });

    if (show.tags != null){
      let t = []
      show.tags.forEach(el => {
        if (el != null ){
          t.push(el)
        }
      })

      ef.patchValue({
        tags:t
      })
    }



    const control = <FormArray>ef.controls['djs'];

    Object.keys(dJs).forEach((key) => {
      control.push(this.initDj());
      control['controls'][key].patchValue({_id: dJs[key]});
      if(key == '0'){
        control.removeAt(control['controls'].length - 1);
      }
    });
  }

  //saves show to the database
  showSubmit(){
    let t = this.myForm.controls['tags'].value;
    var ta = []
    let len = t.length
    for(var i = 0; i < len; i++){
      if (typeof t[i] === 'string') {
        ta.push(t[i])
      } else if (typeof t[i] === 'object'){
        ta.push(t[i].value);
      }
    }

    const show = {
      name: this.myForm.controls['name'].value,
      type: this.myForm.controls['type'].value,
      timeString: this.myForm.controls['time'].value,
      timeSlots: this.myForm.controls['timeSlots'].value,
      djs: this.myForm.controls['djs'].value,
      description: this.descriptionContent,
      startDate: this.myForm.controls['startDate'].value,
      endDate: this.myForm.controls['endDate'].value,
      days: this.myForm.controls['days'].value,
      duration: this.myForm.controls['duration'].value,
      tags: ta,
      thumbnailPath: this.tPath,
      bannerPath: this.bPath,
      placeholder: this.myForm.controls['placeholder'].value
    }

    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/shows/edit/' + this.id);
    return this.http.put(ep, show, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        if(data.success){
          this.flashMessage.show("Changes Saved", {cssClass: 'alert-success', timeout: 5000})
          this.router.navigate(['/manage-shows'])
        } else {
          this.flashMessage.show("Something went wrong on the server", {cssClass: 'alert-danger', timeout: 5000})

        }
      });
  }

  //uploads image to the server, then saves the path to the article to thumnbnailPath variable
  uploadThumbnail(){

    this.uploader1.uploadAll();
    this.uploader1.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            let r = JSON.parse(response)
            this.thumbnailPath = 'http://localhost:3000/' + r.path
            this.tPath = r.path
            this.flashMessage.show('Thumbnail has been uploaded', {cssClass: 'alert-success', timeout: 5000})

        };
  }

  //uploads image to the server, then saves the path to the article to bannerPath variable
  uploadBanner(){

    this.uploader2.uploadAll();
    this.uploader2.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            let r = JSON.parse(response)
            this.bannerPath = 'http://localhost:3000/' + r.path;
            this.bPath = r.path;
            this.flashMessage.show('Banner has been uploaded', {cssClass: 'alert-success', timeout: 5000})

        };
  }



}
