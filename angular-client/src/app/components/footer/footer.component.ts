import { Component, OnInit } from '@angular/core';
import { StaticPagesService } from '../../services/static-pages.service';
import { AdService } from '../../services/ad.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  path:string;
  pages:any;
  bottomAd:any;

  constructor(
    private sp: StaticPagesService,
    private as: AdService
  ) { }

  ngOnInit() {
    this.sp.getPublished().subscribe(data => {
      this.pages = data;
    }, err => {
      console.log(err);
      return false;
    });

    this.as.getAdBySlot('Bottom').subscribe(data => {
      this.bottomAd = data;
      this.path =  data.imagePath;
    }, err => {
      console.log(err);
      return false;
    })
  }

  increment(id) : void {

    let url: string = '';
      if (!/^http[s]?:\/\//.test(this.bottomAd.link)) {
        url += 'http://';
      }

    url += this.bottomAd.link;
    window.open(url, '_blank');
    this.as.increment(id).subscribe(data => {

    })
  }



}
