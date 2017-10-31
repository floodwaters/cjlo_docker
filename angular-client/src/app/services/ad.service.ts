import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers} from '@angular/http';


@Injectable()
export class AdService {

  slots:Array<string> = ['Side', 'Bottom'];

  constructor(
    private authService: AuthService,
    private http:Http
  ) { }

  getAllAds(){
    let headers = this.authService.setHeaders();
    let ep = this.authService.prepEndpoint('http://localhost:3000/ads/get-all');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

}
