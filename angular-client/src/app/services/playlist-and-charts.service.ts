import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';

@Injectable()
export class PlaylistAndChartsService {

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  getPlaylist(start, end){
    let b = {
      start: start,
      end: end
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/plays/get-playlist');
    return this.http.post(ep, b, {headers: headers})
      .map(res => res.json())
  }

  getChart(start, end){
    let b = {
      start: start,
      end: end
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/plays/get-chart');
    return this.http.post(ep, b, {headers: headers})
      .map(res => res.json())

  }

}
