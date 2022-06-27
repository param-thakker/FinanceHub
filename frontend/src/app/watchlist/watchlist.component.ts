import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

import { BackendService } from '../backend.service';

import { Latestprice } from '../latestprice';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  isEmpty;
  watchlistArr;
  tickerInfoArr; 
  fetchFinish = false;
  fetchSubscribe;

  constructor(private backendService: BackendService, private router: Router) {}

  fetchAllTicker() {
    
    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      this.checkEmpty();
      let callArr = [];
      this.watchlistArr.forEach((item) => {
        callArr.push(this.backendService.fetchLatestPrice(item.ticker));
      });
      forkJoin(callArr).subscribe((responses) => {

        let infoArr = [];
        console.log('Response in forkJoin: ' + responses);

        responses.forEach((res: Latestprice) => {
          let tickerName = this.watchlistArr.filter(
            (data) => data.ticker === res.ticker
          )[0].name;
          let info = {
            ticker: res.ticker,
            name: tickerName,
            last: res.c,
            change: res.c - res.d, 
            changePercent: res.dp,
            timestamp: res.t,
          };
          infoArr.push(info);
        });
        this.tickerInfoArr = infoArr;
        this.fetchFinish = true;
        console.log(this.tickerInfoArr);
      });
    });
  }

  checkEmpty() {
    this.watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    if (this.watchlistArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

  public removeFromWatchlist(tickerItem) {
    this.tickerInfoArr.splice(this.tickerInfoArr.indexOf(tickerItem), 1);
    let watchlistArrOld = JSON.parse(localStorage.getItem('Watchlist'));
    let watchlistArrNew = watchlistArrOld.filter(
      (data) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    this.checkEmpty();
  }

  public linkToDetails(ticker) {
    this.router.navigateByUrl('/search/' + ticker);
  }

  ngOnInit() {
    this.fetchAllTicker();

  }

  ngOnDestroy() {
    this.fetchSubscribe.unsubscribe();
    clearTimeout(this.fetchSubscribe);
    console.log('Exist from Watchlist');
  }
}
