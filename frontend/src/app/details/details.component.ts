import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts);

import * as moment from 'moment';
import 'moment-timezone';

import { BackendService } from '../backend.service';

import { TransactionButtonComponent } from '../transaction-button/transaction-button.component';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import { NewsDetailComponent } from '../news-detail/news-detail.component';
import { InsightsComponent } from '../insights/insights.component'

import { Metadata } from '../metadata';
import { Latestprice } from '../latestprice';
import { News } from '../news';
import { DailyPrice } from '../daily-price';
import { HistPrice } from '../hist-price';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

function LATimezonOffset(timestamp) {
  var zone = 'America/Los_Angeles',
    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

  return timezoneOffset;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  private _StarAlertSuccess = new Subject<string>();
  private _buyAlertSuccess = new Subject<string>();
  private _sellAlertSuccess = new Subject<string>();
  public portfolioTickerArray:any[] = [];
  public portfolioList:any;
  fetchSubscribe; 
  starSuccessMessage = '';
  buySuccessMessage = '';
  sellSuccessMessage = ''
  ticker: string = '';
  metadata;
  peers
  latestprice;
  dailycharts;
  histcharts;
  currentTimeLA: string;
  localCurrentTime: number;
  change: number;
  changePercent: number;
  lasttimestamp;
  allnews;
  openstatus = false;
  dailyChartsColor;
  tickerExist = true;
  inWatchlist = false;
  money: number;
  showSellButton: boolean = false;

  
  dailyChartsFinish = false;
  histChartsFinish = false;
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = 'stockChart';
  Highcharts: typeof Highcharts = Highcharts; 
  @ViewChild('highChartsRef') highchartsRef;

  dailyChartOptions: Options;
  histChartOptions: Options;

  allSentiments;
  allRecommendations;
  allCompanyEarnings;

  checkPortfolio(){
    if(localStorage.getItem('Portfolio')){
      this.portfolioList = JSON.parse(localStorage.getItem('Portfolio') || '{}');
      
      console.log(this.ticker, this.portfolioList);
      this.portfolioTickerArray = this.portfolioList.map(function(x:any){
        return x.ticker
      });
      console.log(this.portfolioTickerArray.includes(this.ticker), this.portfolioTickerArray);
      if(this.portfolioTickerArray.includes(this.ticker)){
        this.showSellButton = true;
      }
      else{
        this.showSellButton = false;
      }
    }
    else{
      console.log("No Portfolio available");
      this.portfolioList = [];
    }
  }

  createDailyCharts() {
    let dailyClose = [],
      dataLength = this.dailycharts.c.length; 
    let i, intTimestamp;

    for (i = 0; i < dataLength; i += 1) {
      intTimestamp = this.dailycharts.t[i]*1000;
      dailyClose.push([intTimestamp, this.dailycharts.c[i]]);
    }

    this.dailyChartOptions = {
      series: [
        {
          data: dailyClose,
          color: this.dailyChartsColor,
          showInNavigator: true,
          name: this.ticker.toUpperCase(),
          type: 'line',
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
      title: { text: this.ticker.toUpperCase() },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        series: {
          type: 'area',
          color: this.dailyChartsColor,
          fillOpacity: 1,
        },
      },
      time: {
        getTimezoneOffset: LATimezonOffset,
      },
    }; 
  }

  createHistCharts() {
    let i, intTimestamp;

    
    let ohlc = [],
      volume = [],
      dataLength = this.histcharts.c.length, 
      
     
      groupingUnits = [
        [
          'week', 
          [1], 
        ],
        ['month', [1, 2, 3, 4, 6]],
      ];
      

    for (i = 0; i < dataLength; i += 1) {
      intTimestamp = this.histcharts.t[i]*1000;
     
      ohlc.push([
        intTimestamp, 
        this.histcharts.o[i], 
        this.histcharts.h[i], 
        this.histcharts.l[i], 
        this.histcharts.c[i], 
      ]);

      volume.push([
        intTimestamp, 
        this.histcharts.v[i], 
      ]);
    }

    this.histChartOptions = {
      series: [
        {
          type: 'candlestick',
          name: this.ticker.toUpperCase(),
          id: this.ticker,
          zIndex: 2,
          data: ohlc,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: this.ticker.toUpperCase() + ' Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
  
      },
      rangeSelector: {
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
      },
      time: {
        getTimezoneOffset: LATimezonOffset,
      },
    }; 
  }


  getCurrentTime() {
    //this.localCurrentTime = Date.now();
    let currentLATime=moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
    this.localCurrentTime= new Date(currentLATime).getTime();
  }

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private newsModalService: NgbModal,
    private transModalService: NgbModal,
    private router: Router
  ) {}

  openNewsDetail(news: News) {
    const newsModalRef = this.newsModalService.open(NewsDetailComponent);
    newsModalRef.componentInstance.news = news;
  }

  fetchMetadata() {
    this.backendService.fetchMetadata(this.ticker).subscribe((metadata) => {
      this.metadata = metadata;
      if (this.metadata.ticker) {
        this.tickerExist = true;
      } else {
        this.tickerExist = false;
      }
      console.log('Metadata fetched ' + Date());
      console.log('tickerExist', this.tickerExist);
      console.log('metadata', this.metadata);

    });
  }
  fetchPeers(){
    this.backendService.fetchCompanyPeers(this.ticker).subscribe((peers) => {
      console.log(peers);
      this.peers = peers;
      console.log('Peers Fetched' + Date());
     
    });
  }

  fetchNews() {
    this.backendService.fetchNews(this.ticker).subscribe((allnews) => {
      this.allnews = allnews;
      console.log('News fetched ' + Date());
      console.log('allnews', this.allnews);
    });
  }
  fetchSentiments(){
    this.backendService.fetchSentiments(this.ticker).subscribe((allSentiments)=>{
      this.allSentiments = allSentiments;
      console.log('Sentiments fetched ' + Date());
      console.log('Sentiments', this.allSentiments);
    })
  }

  fetchRecommendations(){
    this.backendService.fetchRecommendations(this.ticker).subscribe((allRecommendations)=>{
      this.allRecommendations = allRecommendations;
      console.log('Recommendations fetched ' + Date());
      console.log('Recommendations', this.allRecommendations);
    })
  }

  fetchCompanyEarnings(){
    this.backendService.fetchCompanyEarnings(this.ticker).subscribe((allCompanyEarnings)=>{
      this.allCompanyEarnings = allCompanyEarnings;
      console.log('Company Earnings fetched ' + Date());
      console.log('Company Earnings', this.allCompanyEarnings);
    })
  }

  fetchLatestPriceNDailyCharts() {
   
    console.log('LatestPriceNDailyCharts Start: ' + Date());

    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
     console.log('Real LatestPriceNDailyCharts Start: ' + Date());
      this.backendService
        .fetchLatestPrice(this.ticker)
        .subscribe((latestprice) => {
          this.latestprice = latestprice;
          if (this.latestprice.c) { 
            this.tickerExist = true;
            this.change = this.latestprice.d; 
            if (this.change > 0) {
              this.dailyChartsColor = '#008000';
            } else if (this.change < 0) {
              this.dailyChartsColor = '#FF0000';
            } else {
              this.dailyChartsColor = '#000000';
            }
            this.changePercent =this.latestprice.dp;
            this.lasttimestamp = this.latestprice.t*1000;
            this.getCurrentTime();
            let timeDifference = (this.localCurrentTime - this.lasttimestamp)/1000;
            console.log("Local time", this.localCurrentTime);
            console.log(this.latestprice.t);
            console.log("timeDifference is ",timeDifference);
 
            if (timeDifference < 300) {
              this.openstatus = true;
            } else {
              this.openstatus = false;
            }
            let lastWorkingDate;
            if (this.openstatus==true){
              lastWorkingDate=this.localCurrentTime;
            }
            else{
              lastWorkingDate=this.lasttimestamp;
            }
            console.log('Last working date: ' + lastWorkingDate);
            this.backendService
              .fetchDailyCharts(this.ticker, lastWorkingDate)
              .subscribe((dailycharts) => {
                this.dailycharts = dailycharts;
                this.dailyChartsFinish = false;
                this.createDailyCharts();
                this.dailyChartsFinish = true;
                console.log('DailyCharts created ' + Date());
              });
          } else {
            this.tickerExist = false;
            this.dailycharts = { detail: 'Not found.' };
          }

          console.log('LatestPrice fetched ' + Date());
        });
    });
  }
  float2int (value) {
    return value | 0;
  }

  fetchHistCharts() {
    let crtTime = new Date();
    let year = crtTime.getFullYear();
    let month = crtTime.getMonth();
    let day = crtTime.getDate();
    let twoYearBack = new Date(year - 2, month, day);
    let histStartDate = twoYearBack.toISOString().slice(0, 10); 
    console.log('Two years before today: ' + histStartDate);

    this.backendService
      .fetchHistCharts(this.ticker, histStartDate)
      .subscribe((histcharts) => {
        this.histcharts = histcharts;
        console.log('HistCharts fetched ' + Date());
        console.log('HistCharts length: ' + this.histcharts.length);
        this.histChartsFinish = false;
        this.createHistCharts();
        this.histChartsFinish = true;
        console.log('HistCharts created ' + Date());
        console.log('hisChartsFinish', this.histChartsFinish);
      });
  }

  checkWatchlist() {
    let watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    let result = watchlistArr.filter(
      (data) => data.ticker === this.ticker.toUpperCase()
    );
    if (result.length) {
      this.inWatchlist = true;
    } else {
      this.inWatchlist = false;
    }
  }

  public onClickStar() {
    this.inWatchlist = !this.inWatchlist;
    let watchlistArr, watchlistArrNew;

    watchlistArr = localStorage.getItem('Watchlist')
      ? JSON.parse(localStorage.getItem('Watchlist'))
      : [];
    if (this.inWatchlist) {
      
      let watchlistItemNew = {
        ticker: this.ticker.toUpperCase(),
        name: this.metadata.name,
      };
      watchlistArr.push(watchlistItemNew);
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArr));
    } else {
    
      watchlistArrNew = watchlistArr.filter(
        (data) => data.ticker != this.ticker.toUpperCase()
      );
      localStorage.setItem('Watchlist', JSON.stringify(watchlistArrNew));
    }
    this._StarAlertSuccess.next('Message successfully changed.');
  }

  openTransectionButton(ticker, name, currentPrice, opt, money) {
    const transModalRef = this.transModalService.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = ticker;
    transModalRef.componentInstance.name = name;
    transModalRef.componentInstance.currentPrice = currentPrice;
    transModalRef.componentInstance.opt = opt;
    transModalRef.componentInstance.money = money;
    console.log(this.money);
    transModalRef.result.then((recItem) => {
  
      console.log(recItem);

      if(recItem != 'Cross click'){
        if(opt == 'Buy'){
          this.checkPortfolio()
          this._buyAlertSuccess.next('Message successfully changed.');
        }
        else if(opt == 'Sell'){
          this.checkPortfolio()
        
          this._sellAlertSuccess.next('Message successfully changed.');
        }
      }      
    });
  }
  navigateToDetailsPage(ticker: string) {
    console.log(ticker);
    this.router.navigateByUrl('/search/' + ticker);
  }

  ngOnInit() {
    this.money = parseFloat(localStorage.getItem('money') || '25000')
    localStorage.setItem('money', this.money.toString());
    this.route.paramMap.subscribe((params) => {
      if(this.histChartsFinish)
        this.highchartsRef.ngOnDestroy();
      this.ticker = (params.get('ticker')).toUpperCase();
      console.log('ticker name in search: ' + this.ticker);
    
      this.checkWatchlist();

      this.fetchMetadata();
      this.fetchPeers();
      this.fetchNews();
      this.fetchLatestPriceNDailyCharts();
      this.fetchHistCharts();
      this.fetchSentiments();
      this.fetchRecommendations();
      this.fetchCompanyEarnings();
      this.checkPortfolio();
      console.log(this.ticker);
      localStorage.setItem('lastTicker', (this.ticker).toString());

    });

    
    this._StarAlertSuccess.subscribe(
      (message) => (this.starSuccessMessage = message)
    );
    this._StarAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.starSuccessMessage = ''));

    this._buyAlertSuccess.subscribe(
      (message) => (this.buySuccessMessage = message)
    );
    this._buyAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.buySuccessMessage = ''));

    this._sellAlertSuccess.subscribe(
      (message) => (this.sellSuccessMessage = message)
    );
    this._buyAlertSuccess
      .pipe(debounceTime(5000))
      .subscribe(() => (this.sellSuccessMessage = ''));
  }

  ngOnDestroy() {
    this.fetchSubscribe.unsubscribe();
    clearTimeout(this.fetchSubscribe);
    console.log(`Exist from Search/${this.ticker}`);
  }
}
