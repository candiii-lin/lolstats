import { Component } from '@angular/core';
import { SummonerService } from './summoner.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'League of Legends Match History';
  name: string;
  summoner: any;
  matches: any;

  constructor(private summonerService: SummonerService,
              private toastrService: ToastrService,
              private spinnerService: Ng4LoadingSpinnerService) { }

  getSummoner() {
    this.spinnerService.show();
    this.matches = null;
    this.summonerService.getSummoner(this.name).subscribe(
      data => this.summoner = data,
      err => this.toastrService.error(err.error, "Oops!"),
      () => { this.spinnerService.hide(); }
    );
  }

  getMatches() {
    this.spinnerService.show();
    this.summonerService.getLatestMatches(this.summoner.accountId).subscribe(
      data => this.matches = data,
      err => this.toastrService.error(err.error, "Oops!"),
      () => {
        this.spinnerService.hide();
      }
    );
  }
}
