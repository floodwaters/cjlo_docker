import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Http, Headers} from '@angular/http';

@Injectable()
export class ShowService {

  constructor(
    private authService:AuthService,
    private http:Http
  ) { }

  // retrieves list of all shows from the api
  getShows(){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/shows/showlist');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

  //changes the on air status of a show
  changeOnAirStatus(show, status){
    let body = {
      id: show._id,
      status: status
    }
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/shows/change-status');
    return this.http.put(ep, body, {headers: headers})
      .map(res => res.json());

  }

  deleteShow(id): Promise<void>{
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/shows/delete/' + id);
    return this.http.delete(ep, {headers: headers})
      .map(res => res.json())
      .toPromise()
  }

  getShowById(id){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/shows/get/' + id);
    return this.http.get(ep, {headers: headers})
      .map(res => res.json())
  }


}
