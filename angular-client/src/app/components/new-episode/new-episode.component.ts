import { Component, OnInit } from '@angular/core';
import {ShowService} from '../../services/show.service';
import {AuthService} from '../../services/auth.service';
import {EpisodeService} from '../../services/episode.service';
import {DateTimeService} from '../../services/date-time.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;


@Component({
  selector: 'app-new-episode',
  templateUrl: './new-episode.component.html',
  styleUrls: ['./new-episode.component.css']
})
export class NewEpisodeComponent implements OnInit {

  episodeId:number;
  showId:number;
  show:any;
  date:Date;
  minDate: Date = new Date(Date.now());
  maxDate: Date = new Date(Date.now());
  endDate: Date;
  disabledDates:Array<Date>;
  startHour:number;
  startMinute:number;
  episodeCreated:boolean = false;
  editorContent:string;
  socan:boolean = false;
  types:Array<string> = ['Talk', 'News', 'Ad', 'Weather', 'Background', 'Station Id'];
  contentTypes:Array<string> = ['CanCon', 'LGBTQ', 'Indigenous'];
  day:number;
  year:number;
  month:number;

  public myForm: FormGroup;


  public options: Object = {
    height: 300,
    placeholderText: 'Enter episode description here'
  }

  constructor(
    private authService:AuthService,
    private showService:ShowService,
    private episodeService:EpisodeService,
    private route:ActivatedRoute,
    private router:Router,
    private dateTime:DateTimeService,
    private flashMessage:FlashMessagesService,
    private _fb:FormBuilder

  ) { }

  ngOnInit() {

    this.minDate.setDate(this.minDate.getDate() - 8)
    this.maxDate.setMonth(this.minDate.getMonth() + 1);

    this.showId = this.route.snapshot.params['id'];

    this.showService.getShowById(this.showId).subscribe(data => {
      this.show = data
      this.disabledDates = this.disableDates(this.show)
      this.startHour = this.dateTime.getStartHour(this.show);
      this.startMinute = this.dateTime.getStartMinute(this.show)

    },
    err => {
      console.log(err)
      return false
    });


  }

  disableDates(show){
    var dates = []
    for (var d = new Date(this.minDate); d <= new Date(this.maxDate); new Date(d.setDate(d.getDate() + 1))){

      if (show.days.indexOf(d.getDay()) === -1){
        let s = d.getFullYear().toString();
        let f = d.getDate().toString();
        let q = (d.getMonth() +1).toString();
      dates.push(new Date(s + '/' + q + '/' + f));
      }
    }

    return dates
  }

  createEpisode(){

    if (!this.date){
      this.flashMessage.show('Please select a date', {cssClass: 'alert-danger', timeout: 5000})
      return false
    }

    this.endDate = this.dateTime.calculateEndDate(this.date, this.show);

    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    this.myForm = this._fb.group({
      tracks: this._fb.array([this.initTrack()])
    })


    this.myForm.controls['tracks']['controls'][0]['controls']['startDate'].patchValue(this.year.toString() + '-' + (this.month + 1).toString() + '-' + this.day.toString() + ' ' + this.startHour.toString() + ':00' )
    this.myForm.controls['tracks']['controls'][0]['controls']['startSecond'].patchValue(0)

    this.myForm.controls['tracks']['controls'][0]['controls']['endDate'].patchValue(this.year.toString() + '-' + (this.month + 1).toString() + '-' + this.day.toString() + ' ' + this.startHour.toString() + ':00')
    this.myForm.controls['tracks']['controls'][0]['controls']['endSecond'].patchValue(0)


    this.episodeService.createEpisode(this.date, this.showId, this.endDate).subscribe(data => {
      if (data.success){
        this.episodeId = data.id;
        this.episodeCreated = true;
        this.flashMessage.show('Episode Created', {cssClass: 'alert-success', timeout: 5000})
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000})
      }
    },
    err => {
      console.log(err);
      return false
    });
  }

  saveBody(){
    let body = this.editorContent;
    this.episodeService.saveBody(body, this.episodeId).subscribe(data => {
      if (data.success){
        this.flashMessage.show('Episode description saved', {cssClass: 'alert-success', timeout: 5000})
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 5000})
      }
    },
    err => {
      console.log(err)
      return false
    })
  }

  setHours(){
    this.date.setHours(this.startHour);
    this.date.setMinutes(this.startMinute);
  }




  initTrack(){
    if(!this.socan){
      return this._fb.group({
        classification: ['Theme', [Validators.required]],
        startDate: [null, [Validators.required]],
        startSecond: [null, [Validators.required]],
        endDate:[null, [Validators.required]],
        endSecond:[null, [Validators.required]],
        contentTypes: new FormArray([])
      })
    } else {
      return this._fb.group({
        classification: ['Theme', [Validators.required]],
        startDate: [null, [Validators.required]],
        startSecond: [null, [Validators.required]],
        endDate:[null, [Validators.required]],
        endSecond:[null, [Validators.required]],
        composer:['', [Validators.required]],
        contentTypes: new FormArray([])
      });
    }
  }

  removeTrack(i: number) {
      // remove track from the list
      const control = <FormArray>this.myForm.controls['tracks'];
      control.removeAt(i);
  }

  onCheckChange(event, i) {

  const formArray: FormArray = this.myForm.controls['tracks']['controls'][i].get('contentTypes') as FormArray;
  console.log(formArray)

  /* Selected */
  if(event.target.checked){
    // Add a new control in the arrayForm
    formArray.push(new FormControl(event.target.value));
  }
  /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

}
