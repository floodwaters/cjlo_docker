import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ShowService } from '../../services/show.service';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.css']
})
export class ShowPageComponent implements OnInit {
  id:number;
  thumbnailPath:string;
  bannerPath:string;
  show:any;

  constructor(
    private route:ActivatedRoute,
    private authService:AuthService,
    private showService:ShowService,
    private router:Router

  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.showService.getShowById(this.id).subscribe(data => {
      this.show = data;
      if(data.thumbnailPath){
        this.thumbnailPath = 'http://localhost:3000/' + data.thumbnailPath;
      }
      if(data.bannerPath){
        this.bannerPath = 'http://localhost:3000/' + data.bannerPath;
      }

    },
    err => {
      console.log(err)
      return false
    })

  }

}
