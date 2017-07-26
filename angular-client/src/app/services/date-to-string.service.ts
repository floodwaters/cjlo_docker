import { Injectable } from '@angular/core';

@Injectable()
export class DateToStringService {

  constructor() { }

  formatDate(date) {
    date = new Date(date);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ', ' + year;
  }

}
