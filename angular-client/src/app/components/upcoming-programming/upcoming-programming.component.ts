import { Component, OnInit } from '@angular/core';
import { DateTimeService } from '../../services/date-time.service';
import { ShowService } from '../../services/show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-programming',
  templateUrl: './upcoming-programming.component.html',
  styleUrls: ['./upcoming-programming.component.css']
})
export class UpcomingProgrammingComponent implements OnInit {

  selectedDate: Date = new Date(Date.now());
  nextDate: Date = new Date(this.selectedDate);
  previousDate: Date = new Date(this.selectedDate);
  todayShows: any;
  tomorrowShows: any;
  yesterdayShows: any;
  sortedYesterdayShows: any;
  displayShows: Array<any>;
  placeholder: any;
  fullArray: any;

  constructor(
    private dt: DateTimeService,
    private router: Router,
    private showService: ShowService
  ) { }

  ngOnInit() {

  this.nextDate.setDate(this.selectedDate.getDate() + 1);

  this.previousDate.setDate(this.selectedDate.getDate() - 1);


  this.showService.getShowsForDay(this.selectedDate.getDay()).subscribe(data => {
    this.todayShows = data;


      this.showService.getShowsForDay(this.nextDate.getDay()).subscribe(data => {
        this.tomorrowShows = data;

        this.showService.getShowsForDay(this.previousDate.getDay()).subscribe(data => {
          this.yesterdayShows = data;

          this.sortedYesterdayShows = this.sortShows(data);
          this.sortBothShows();
          this.firstShow();
          this.fillInPlaceholders();

          console.log(this.fullArray);

        }, err => {
          console.log(err);
          return false
        });


      }, err => {
        console.log(err);
        return false
      });


  }, err => {
    console.log(err);
    return false
  });



  this.showService.getPlaceholder().subscribe(data => {
    this.placeholder = data;
  }, err => {
    console.log(err);
    return false;
  })
  }


//increments the show for display up by 1
  upSlot() {
    console.log(this.sortShows(this.todayShows))
  }

//increments the show for display down by 1
  downSlot() {
  }

  populate(shows, date){
    this.displayShows = [];

    let hour = date.getHours();
    let minute = date.getMinutes();
    let day = date.getDay();
    let da = date.getDate();

  }

  //takes an unsorted object containing shows, and returns an array of shows sorted by starting time
  sortShows(shows){
    let ar = [];

    let unsorted = Object.keys(shows);

    Object.keys(shows).sort((a, b) => {
      if(Number(shows[a].startHour) > Number(shows[b].startHour)){
        return 1;
      } else if (Number(shows[a].startHour) > Number(shows[b].startHour)){
        return -1;
      } else if ((Number(shows[a].startHour) === Number(shows[b].startHour)) && (Number(shows[a].startMinute) > Number(shows[b].startMinute))){
        return 1;
      } else if ((Number(shows[a].startHour) === Number(shows[b].startHour)) && (Number(shows[a].startMinute) < Number(shows[b].startMinute))){
        return -1;
      } else {
        return 0;
      }
    }).forEach(el => {
      ar.push(shows[el]);
    });

    return ar
  }

  //creates array of shows for first and second day ordered by start timeslots
  sortBothShows(){
    let ar = []

    let ts = this.sortShows(this.todayShows);
    let tm = this.sortShows(this.tomorrowShows);

    ts.forEach(el => { ar.push(el)});
    tm.forEach(el => { ar.push(el)});

    this.fullArray = ar;
  }

  //if there is a show carrying over from the previous day, brings it in and puts it at the start of the array of today's shows
  firstShow(){
    let ar = this.fullArray;
    let ys = this.sortedYesterdayShows;


    if((Number(ar[0].startHour) > 0) || ((Number(ar[0].startMinute) > 0) && (Number(ar[0].startHour) === 0)) && this.checkLastShow()) {
      ar.unshift(ys[ys.length - 1]);

      this.fullArray = ar;

    } else if ((Number(ar[0].startHour) > 0) || ((Number(ar[0].startMinute) > 0) && (Number(ar[0].startHour) === 0)) && !this.checkLastShow()) {
      let ph = this.placeholder;

      ph.startHour = '00';
      ph.startMinute = '00';
      ph.endHour = '00';
      ph.endMinute = '30';

      ar.unshift(ph);

      this.fullArray = ar;
    }
  }

  //fills in the placeholders for the day
  fillInPlaceholders(){
    let ar = this.fullArray;
    let counter = 0;



    for(let i = 0; i = ar.length - 1; i++){
      if(i != ar.length - 1){
        if((ar[i].endHour != ar[i + 1].startHour) && (ar[i].endMinute != ar[i + 1].startMinute)){
          counter = this.calculateDifference(ar[i], ar[i + 1]);

          for(let j = counter; j > 0; j--){
            let ph = this.placeholder;
            let d = new Date();

            d.setHours(Number(ar[i].endHour));
            d.setMinutes(Number(ar[i].endMinute));

            let d2 = new Date(d);
            d2.setMinutes(d2.getMinutes() + 30);

            ph.startHour = ar[i].endHour;
            ph.endMinute = ar[i].endMinute;
            ph.endHour =  this.stringify(d2.getHours());
            ph.endMinutes = this.stringify(d2.getMinutes());

            ar.splice(i + 1, 0, ph);
          }
        }
      } else {
        if(this.checkIfEndDay(ar[i])){

        }
      }

    }

    this.fullArray = ar;
  }

  //checks if a show crosses midnight, or ends at midnight
  checkIfEndDay(show: any){
    if(((show.endHour === '00') && (show.endMinute === '00')) || (Number(show.endHour) < Number(show.startHour))) {
      return true;
    } else {
      return false;
    }
  }

  //adds a 0 to a number if it is less than 10 and returns that number as a string
  stringify(num: number){
    return num < 10 ? '0' + num.toString() : num;
  }

  //returns the nunmber of 30 minute intervals between two shows
  calculateDifference(show1: any, show2: any){
    let h1 = Number(show1.endHour);
    let m1 = Number(show1.endMinute);
    let h2 = Number(show2.startHour);
    let m2 = Number(show2.startMinute);

    let d1 = new Date();
    let d2 = new Date();

    d1.setHours(h1);
    d1.setMinutes(m1);

    d2.setHours(h2);
    d2.setMinutes(m2);

    let minutes = 1000 * 60;

    let t = d2.getTime() - d1.getTime();

    return (t / minutes) / 30;
  }

  //checks to see if the end time of the last show from the previous day is in the current day; returns true if it is
  checkLastShow(){
    let ys = this.sortedYesterdayShows;
    return Number(ys[ys.length - 1].endHour) < Number(ys[ys.length - 1].endHour) ? true : false;
  }

  goToSchedule(){
    this.router.navigate(['calendar']);
  }

}
