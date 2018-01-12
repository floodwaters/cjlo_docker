import { Component, OnInit } from '@angular/core';
import { DateTimeService } from '../../services/date-time.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-programming',
  templateUrl: './upcoming-programming.component.html',
  styleUrls: ['./upcoming-programming.component.css']
})
export class UpcomingProgrammingComponent implements OnInit {

  selectedDate: Date = new Date(Date.now());

  constructor(
    private dt: DateTimeService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  upDate() {
    this.selectedDate.setMinutes(this.selectedDate.getMinutes() + 30)
  }

  downDate() {
    this.selectedDate.setMinutes(this.selectedDate.getMinutes() - 30)
  }

  goToSchedule(){
    this.router.navigate(['calendar']);
  }

}
