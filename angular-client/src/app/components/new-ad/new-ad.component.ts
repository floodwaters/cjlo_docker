import { Component, OnInit } from '@angular/core';
import { AdService } from '../../services/ad.service';

@Component({
  selector: 'app-new-ad',
  templateUrl: './new-ad.component.html',
  styleUrls: ['./new-ad.component.css']
})
export class NewAdComponent implements OnInit {

  constructor(
    private as: AdService
  ) { }

  ngOnInit() {
  }

}
