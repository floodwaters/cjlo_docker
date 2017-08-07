import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DateToStringService} from '../../services/date-to-string.service';
import { DateTimeService } from '../../services/date-time.service';
import { ShowService } from '../../services/show.service';
import * as moment from 'moment';

const Moment: any = (<any>moment).default || moment;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedDate:Date = new Date(Date.now())

  constructor(
    private dateTime:DateTimeService,
    private showService:ShowService
  ) { }

  ngOnInit() {
  }



  deincrementDay(){
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1))
  }

  incrementDay(){
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1))

  }




}
