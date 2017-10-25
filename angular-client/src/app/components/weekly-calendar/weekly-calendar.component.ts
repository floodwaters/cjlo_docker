import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {DateTimeService} from '../../services/date-time.service';
import {ShowService} from '../../services/show.service';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WeeklyCalendarComponent implements OnInit {
  @Input() selectedDate:Date;
  day1Shows:any;
  day2Shows:any;
  day3Shows:any;
  day4Shows:any;
  day5Shows:any;
  day6Shows:any;
  day7Shows:any;
  day8Shows:any;
  day:number;
  placeholder:any;



  constructor(
    private dateTime:DateTimeService,
    private showService:ShowService
  ) { }

  ngOnInit() {

    this.day = this.selectedDate.getDay();

    this.showService.getPlaceholder().subscribe(data => {
      this.placeholder = data;
    }, err => {
      console.log(err);
      return false;
    })


    this.showService.getShowsForDay(this.selectedDate.getDay()).subscribe(data => {
      this.day1Shows = data;

    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 1)).subscribe(data => {
      this.day2Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 2)).subscribe(data => {
      this.day3Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 3)).subscribe(data => {
      this.day4Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 4)).subscribe(data => {
      this.day5Shows = data
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 5)).subscribe(data => {
      this.day6Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 6)).subscribe(data => {
      this.day7Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

    this.showService.getShowsForDay(this.dateTime.dateForImport(this.day, 7)).subscribe(data => {
      this.day8Shows = data;
    },
    err => {
      console.log(err);
      return false
    });

  }



  dayName(n){
    var day = this.dateTime.getDayForWeekly(this.selectedDate, n)
    return "<h4><strong>" + day +"</strong></h4>"
  }

  displaySlot(day, slot){
    var showDay = this.getShowDay(day);

    let shows = this.getShowsInSlot(slot, showDay);



    if(shows){
      if(this.checkPreviousSlot(slot, shows, showDay, day)){
        return null;
      } else {
        let s = this.findByType('One-off', shows, day);
        let w = this.findByType('Weekly', shows, day);
        let b = this.findByType('Bi-weekly', shows, day);

        if (s.length === 1){
          return this.display(s)
        } else if ( s.length > 1 ) {
          return this.display(s[0]);
        } else if ((s.length === 0) && (w.length === 1)){
          return this.display(w);
        } else if ((s.length === 0) && (w.length > 1)){
          return this.display(w[0]);
        } else if ((s.length === 0 ) && (w.length === 0) && (b.length > 0)){
          let f = this.calculateBiWeekly(b, this.calculateDate(day))
          if (f.length === 0) {
            return this.displayPlaceholder();
          } else {
            return this.display(f)
          }
        } else {
          return this.displayPlaceholder();
        }
      }
    }
  }

  calculateDate(day){

    var d = new Date(this.selectedDate.valueOf());

    if(day == 0){
      return new Date(d);
    } else if (day == 1){
      return new Date(d.setDate(d.getDate() + 1));
    } else if (day == 2){
      return new Date(d.setDate(d.getDate() + 2));
    } else if (day == 3){
      return new Date(d.setDate(d.getDate() + 3));
    } else if (day == 4){
      return new Date(d.setDate(d.getDate() + 4));
    } else if (day == 5){
      return new Date(d.setDate(d.getDate() + 5));
    } else if (day == 6){
      return new Date(d.setDate(d.getDate() + 6));
    } else if (day == 7){
      return new Date(d.setDate(d.getDate() + 7));
    }

  }

  getShowsInSlot(slot, shows){
    if(shows){
      return shows.filter(el => el.timeslots.some(timeslot => timeslot === slot))
    }
  }

  checkPreviousSlot(slot, shows, showDay, day){
    var s = null
    if(slot === 0){
      s = this.getShowsInSlot(47, this.getShowDay(day - 1));
    } else {
      s = this.getShowsInSlot(slot - 1, showDay);
    }
    if(shows){
      return shows.some((v) => {
        return s.indexOf(v) >= 0;
      })
    }

  }

  getShowDay(day){
    if(day == 0){
      return this.day1Shows;
    } else if (day == 1){
      return this.day2Shows;
    } else if (day == 2){
      return this.day3Shows;
    } else if (day == 3){
      return this.day4Shows;
    } else if (day == 4){
      return this.day5Shows;
    } else if (day == 5){
      return this.day6Shows;
    } else if (day == 6){
      return this.day7Shows;
    } else if (day == 7){
      return this.day8Shows;
    }
  }

  findByType(type, shows, day){
    if(shows){
      return shows.filter(el =>{
        let d = new Date(this.selectedDate.valueOf());
        let value;
        var d1 = null;
        if(day == 0){
          d1 = new Date(d);
        } else if (day == 1){
          d1 = new Date(d.setDate(d.getDate() + 1));
        } else if (day == 2){
          d1 = new Date(d.setDate(d.getDate() + 2));
        } else if (day == 3){
          d1 = new Date(d.setDate(d.getDate() + 3));
        } else if (day == 4){
          d1 = new Date(d.setDate(d.getDate() + 4));
        } else if (day == 5){
          d1 = new Date(d.setDate(d.getDate() + 5));
        } else if (day == 6){
          d1 = new Date(d.setDate(d.getDate() + 6));
        } else if (day == 7){
          d1 = new Date(d.setDate(d.getDate() + 7));
        }
        let d2 = new Date(el.startDate);

        if (el.endDate){
          var d3 = new Date(el.endDate);
        } else {
           d3 = null
        }

        if ((el.type === type) && (d2 < d1) && (d3 > d1)){
          value = value + el;
        } else if ((el.type === type) && (d2 < d1) && (d3 === null)){
          value = value + el;
        }

        return value;
      });
    }

  }

  display(show){

    let duration = this.getDuration(show);
    let s = show[0]

    return ['<div class="', duration, ' flipper','"><div class="title front">', s.name, '</div><div class="back">', s.description, '</div></div>'].join('');


  }

  calculateBiWeekly(shows, date){
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return shows.filter(el => {
      let d = new Date(el.startDate)
      let d1 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
      let d2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      if ((Math.floor(((d2 - d1)) / _MS_PER_DAY) % 14) === 0){
        return el
      }
    })
  }

  //displays a placeholder show in a slot if no show is assigned to that slot
  displayPlaceholder(){
    if(this.placeholder){
      return ['<div class="half-hour">', this.placeholder.name, '</div>'].join('');
    }
  }

  getDuration(show){
    let dur = show[0].duration
    if(dur === '1 hr'){
      return 'one-hour';
    } else if (dur === '1/2 hr') {
      return 'half-hour';
    } else if (dur === '2 hr') {
      return 'two-hour';
    } else if (dur === '3 hr') {
      return 'three-hour';
    }
  }

}
