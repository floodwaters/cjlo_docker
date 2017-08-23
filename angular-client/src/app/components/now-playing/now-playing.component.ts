import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { NowPlayingService } from '../../services/now-playing.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent implements OnInit, OnDestroy {

  tracks:any;
  currentEpisode:any
  currentTrack:any = null;
  currentShow:any;
  alive: boolean;
  display: boolean;
  timer: Observable<number>;
  interval: number;

  constructor(
    private npService: NowPlayingService
  ) {
    this.display = false;
    this.alive = true;
    this.interval = 2000;
    this.timer = Observable.timer(0, this.interval);
   }

  ngOnInit() {
    this.timer
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.npService.getCurrentEpisode()
          .subscribe((data) => {
              this.currentEpisode = data;
              if(data.show){
                this.currentShow = data.show;
              }

              if(data.plays){

                this.tracks = data.plays;
                this.currentTrack = this.getCurrentTrack(this.tracks);

              }

              if(!this.display){
                this.display = true;
              }

              if(data.success === false){
                this.npService.getPlaceholder().subscribe(data1 => {
                  this.currentShow = data1;
                  this.tracks = null;
                  this.npService.getCurrentTrack().subscribe(data2 => {
                    if(!data2.success){
                      this.currentTrack = null
                    } else {
                      this.currentTrack = data2;
                    }
                  }, err => {
                    console.log(err)
                    return false
                  })
                }, err => {
                  console.log(err)
                  return false
                })

              }


          }, err=> {
            console.log(err)
            return false
          });
      });
  }

  ngOnDestroy(){
    this.alive = false;
  }

  getCurrentTrack(tracks){
    var result = {}
    Object.keys(tracks).forEach(key => {

      if((new Date(tracks[key].startTime) < new Date(Date.now())) && (new Date(tracks[key].endTime) > new Date(Date.now()))){
        result = tracks[key]

      }
    })
    return result
  }

}
