import { Component, OnInit } from '@angular/core';
import { StaticPagesService } from '../../services/static-pages.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  pages:any;

  constructor(
    private sp: StaticPagesService
  ) { }

  ngOnInit() {
    this.sp.getPublished().subscribe(data => {
      this.pages = data;
    }, err => {
      console.log(err);
      return false;
    });
  }



}
