import { Component, OnInit } from '@angular/core';
import { PlaylistAndChartsService } from '../../services/playlist-and-charts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chart:any;

  constructor(
    private pc: PlaylistAndChartsService
  ) { }

  ngOnInit() {

    this.pc.getFrontChart('Top 30').subscribe(data => {
      this.chart = data;
    }, err => {
      console.log(err);
      return false;
    })
  }

}
