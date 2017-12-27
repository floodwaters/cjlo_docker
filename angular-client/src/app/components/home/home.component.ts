import { Component, OnInit } from '@angular/core';
import { PlaylistAndChartsService } from '../../services/playlist-and-charts.service';
import { AdService } from '../../services/ad.service';
import {AuthService} from '../../services/auth.service';
import {Http, Headers} from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  chart:any = "Top 30";
  sideAd:any;
  path:string;
  selectedIndex: number = 1;
  spotlight: any;
  articleIndex: number = 1;
  articleCategory:string = "Magazine";

  constructor(
    private pc: PlaylistAndChartsService,
    private as: AdService,
    private authService: AuthService,
    private http: Http
  ) { }

  ngOnInit() {

    this.getSpotlight().subscribe(data => {
      this.spotlight = data[0];
    }, err => {
      console.log(err);
      return false;
    })

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

  select(string, e, n) : void {
    this.chart = string;
    this.selectedIndex = n;
  }

  selectArticles(string, n) : void {
    this.articleCategory = string;
    this.articleIndex = n;
  }

  getSpotlight(){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/articles/get-spotlight');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

}
