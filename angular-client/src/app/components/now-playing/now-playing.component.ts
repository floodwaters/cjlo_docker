import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { NowPlayingService } from '../../services/now-playing.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent implements OnInit, OnDestroy {

  private audio:any;
  tracks:any;
  volume: number = 0.5;
  currentEpisode:any
  currentTrack:any = null;
  currentShow:any;
  alive: boolean;
  display: boolean;
  timer: Observable<number>;
  interval: number;
  playing: boolean = false;
  src: string = 'http://rosetta.shoutca.st:8883/stream'

  constructor(
    private npService: NowPlayingService
  ) {
    this.display = false;
    this.alive = true;
    this.interval = 2000;
    this.timer = Observable.timer(0, this.interval);
    this.audio = new Audio();
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

  play(){
    this.audio.src = this.src;
    this.audio.volume = this.volume;
    this.audio.play();
    this.playing = true;
  }

  pause(){
    this.audio.pause();
    this.playing = false;
  }

  changeVolume(e){
    this.audio.volume = e;
  }

  live(){

    this.src = 'http://rosetta.shoutca.st:8883/stream';
    if($('.playlist-builder').is(':visible')) {
      $('.playlist-builder').slideToggle();
    }
  }


  toggleBuilder(){
    this.src = encodeURI('http://localhost:3000/public/episodes/test/Track 1.wav');
    $('.playlist-builder').slideToggle();
  }
}
