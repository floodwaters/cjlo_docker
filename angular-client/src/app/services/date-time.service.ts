import { Injectable } from '@angular/core';
import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;

@Injectable()
export class DateTimeService {

  constructor() { }

  monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  times = ['0000-0030', '0030-0100', '0130-0200', '0200-0230', '0230-0300', '0300-0330', '0330-0400', '0400-0430', '0430-0500', '0500-0530', '0530-0600', '0600-0630', '0630-0700', '0700-0730', '0730-0800', '0800-0830', '0830-0900', '0900-0930', '0930-1000', '1000-1030', '1030-1100', '1100-1130', '1130-1200', '1200-1230', '1230-1300', '1300-1330', '1330-1400', '1400-1430', '1430-1500', '1500-1530', '1530-1600', '1600-1630', '1630-1700', '1700-1730', '1730-1800', '1800-1830', '1830-1900', '1900-1930', '1930-2000', '2000-2030', '2030-2100', '2100-2130', '2130-2200', '2200-2230', '2230-2300', '2300-2330', '2330-0000'];

  makeIntoObjects(array){
  var objArray = []
  let len = array.length
    for (var i = 0; i < len; i++){
      objArray.push({id: i, name: array[i]})
    }
  return objArray
  }

  displayMonth(date){
    let monthIndex = date.getMonth();
    return this.monthNames[monthIndex]
  }

  displayDay(date){
    let dayIndex = date.getDay();
    return this.days[dayIndex];
  }

  displayDate(date){
    return date.getDate();
  }
}
