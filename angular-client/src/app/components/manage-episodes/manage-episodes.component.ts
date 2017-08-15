import { Component, OnInit } from '@angular/core';
import {ShowService} from '../../services/show.service';
import {AuthService} from '../../services/auth.service';
import {DateToStringService} from '../../services/date-to-string.service';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-manage-episodes',
  templateUrl: './manage-episodes.component.html',
  styleUrls: ['./manage-episodes.component.css']
})
export class ManageEpisodesComponent implements OnInit {

  pastEpisodes:any;
  upcomingEpisodes:any;
  showId:number;
  show:any;

  constructor(
    private dateString:DateToStringService,
    private authService:AuthService,
    private showService:ShowService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {

    this.showId = this.route.snapshot.params['id'];

    this.showService.getShowById(this.showId).subscribe(data => {
      this.show = data
    },
    err => {
      console.log(err)
      return false
    });

  }

  newEpisode(){
    this.router.navigate(['new-episode', this.showId])
  }

}
