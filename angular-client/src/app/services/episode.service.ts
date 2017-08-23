import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';


@Injectable()
export class EpisodeService {

  constructor(
    private authService:AuthService,
    private http:Http
  ) { }

  createEpisode(date, showId, endDate, socan){
    let body = {airDate: date, show: showId, endDate: endDate, socan: socan}
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/create');
    return this.http.post(ep, body, {headers: headers})
      .map(res => res.json());

  }

  saveBody(body, id){
    let b = {
      body: body,
      show: id
    }

    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/body');
    return this.http.put(ep, b, {headers: headers})
      .map(res => res.json());
  }

  saveTrack(track){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/save-track');
    return this.http.post(ep, track, {headers: headers})
      .map(res => res.json());
  }

  editTrack(track){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/edit-track');
    return this.http.put(ep, track, {headers: headers})
      .map(res => res.json());

  }

  deleteTrack(index, episode){

    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/delete-track/'+ episode +'/' + index);
    return this.http.delete(ep, {headers: headers})
      .map(res => res.json());
  }

  getUpcoming(id){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/get-upcoming-episodes/' + id);
    return this.http.get(ep, {headers: headers})
      .map(res => res.json())
  }

  getPast(id){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/get-past-episodes/' + id);
    return this.http.get(ep, {headers: headers})
      .map(res => res.json())
  }

  deleteEpisode(id){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/delete/' + id);
    return this.http.delete(ep, {headers: headers})
      .map(res => res.json())
  }

  getEpisodeById(id){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/episodes/get-episode/' + id);
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }
}
