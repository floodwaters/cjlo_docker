import { Component, OnInit } from '@angular/core';
import { PlaylistAndChartsService } from '../../services/playlist-and-charts.service';
import { AdService } from '../../services/ad.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chart:any;
  sideAd:any;
  path:string;

  constructor(
    private pc: PlaylistAndChartsService,
    private as: AdService
  ) { }

  ngOnInit() {

    this.pc.getFrontChart('Top 30').subscribe(data => {
      this.chart = data;
    }, err => {
      console.log(err);
      return false;
    });

    this.as.getAdBySlot('Side').subscribe(data => {
      this.sideAd = data;
      this.path =  data.imagePath;
    }, err => {
      console.log(err);
      return false;
    })
  }

  increment(id) : void {

    let url: string = '';
      if (!/^http[s]?:\/\//.test(this.sideAd.link)) {
        url += 'http://';
      }

    url += this.sideAd.link;
    window.open(url, '_blank');
    this.as.increment(id).subscribe(data => {

    })
  }

}
