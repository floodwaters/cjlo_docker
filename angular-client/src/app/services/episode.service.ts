import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';


@Injectable()
export class EpisodeService {

  constructor(
    private authService:AuthService,
    private http:Http
  ) { }

  createEpisode(date, showId, endDate){
    let body = {airDate: date, show: showId, endDate: endDate}
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
}
