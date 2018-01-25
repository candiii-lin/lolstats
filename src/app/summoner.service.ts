import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SummonerService {

  constructor(private http: HttpClient) { }

  getSummoner(name: string): Observable<any> {
    return this.http.get<any>(`/api/summoner/${name}`);
  }

  getLatestMatches(accountId: number): Observable<any> {
    return this.http.get<any>(`/api/latestmatches/${accountId}`);
  }

}
