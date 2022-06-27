import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {BackendService as ApiCallService} from "../backend.service";

@Component({
  selector: 'app-watchlist-wrapper',
  templateUrl: './watchlist-wrapper.component.html'
})
export class WatchlistWrapperComponent implements OnInit {
  public favourites: any;
  public allTickers: any;
  public stockData: any;
  public emptyWatchlistAlert:boolean = true;

  constructor(private router: Router, private apiCall: ApiCallService) {
  }


  ngOnInit(): void {
    if(localStorage.getItem('Watchlist') != undefined && localStorage.getItem('Watchlist') != '[]'){
      this.emptyWatchlistAlert = false;
      this.favourites = JSON.parse(localStorage.getItem('Watchlist')|| '{}').sort();
      console.log(this.favourites);
      this.allTickers = "";
      for(let i = 0; i < this.favourites.length - 1; i++){
        this.allTickers += this.favourites[i].ticker + ',';
      }
      this.allTickers += this.favourites[this.favourites.length - 1].ticker;
      console.log(this.allTickers);
      this.getDetails();
    }
    else{
      this.emptyWatchlistAlert = true;
      this.favourites = [];
    }
    console.log(this.favourites);
  }

  navigateToDetailsPage(ticker:any) {
    this.router.navigateByUrl('/search/'+ticker);
  }

  removeFromWatchlist(ticker:any){
      this.favourites = this.favourites.filter((item: { [x: string]: any; }) => item['ticker'] != ticker);
      localStorage.setItem('Watchlist', JSON.stringify(this.favourites));
      this.allTickers = "";
      console.log(this.favourites, typeof(this.favourites));
      if(this.favourites.length > 0){
        for(let i = 0; i < this.favourites.length - 1; i++){
          this.allTickers += this.favourites[i].ticker + ',';
        }
        this.allTickers += this.favourites[this.favourites.length - 1].ticker;
        console.log(this.favourites);
        this.getDetails();
      }
      else{
        this.stockData = [];
        this.emptyWatchlistAlert = true;
      }
  }

  getColor(data:any){
    if(data['d'] < 0){
      data['color'] = "red";
    }
    else if(data['change'] > 0){
      data['color'] = "green";
    }
    else{
      data['color'] = "black";
    }
    return data
  }

  getDetails(){
    if(this.favourites != []){
       let temp:any[] = []
       this.favourites.forEach((element)=>{
        console.log(element);
        this.apiCall.fetchLatestPrice(element.ticker).subscribe((data: any) => {
          console.log(data);

          data = this.getColor(data);
          data['name'] = element.name;
          data['ticker'] = element.ticker;
          temp.push(data);
      });

       })
      this.stockData = temp;
    }
    else{
      this.emptyWatchlistAlert = true;
    }
  }
}
