import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, timer, forkJoin } from 'rxjs';

import { TransactionButtonComponent } from '../transaction-button/transaction-button.component';

import { BackendService } from '../backend.service';

import { Latestprice } from '../latestprice';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  portfolioArr;
  isEmpty;
  tickerInfoArr; 
  fetchFinish = false;
  fetchSubscribe;

  constructor(
    private backendService: BackendService,
    private transModalService: NgbModal
  ) {}

  fetchAllTicker() {
    console.log('Start fetch ' + Date());
    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      this.checkEmpty();
      let callArr = [];
      this.portfolioArr.forEach((item) => {
        callArr.push(this.backendService.fetchLatestPrice(item.ticker));
      });
      forkJoin(callArr).subscribe((responses) => {
       

        let infoArr = [];
        responses.forEach((res: Latestprice) => {
          let tmpItem = this.portfolioArr.filter(
            (data) => data.ticker === res.ticker
          )[0];
          let avgcst = tmpItem.totalCost / tmpItem.quantity;
          let info = {
            ticker: res.ticker, 
            name: tmpItem.name,
            quantity: tmpItem.quantity,
            totalCost: tmpItem.totalCost,
            avgCost: avgcst, 
            change: avgcst - res.c, 
            currentPrice: res.l, 
            marketValue: res.c * tmpItem.quantity, 
          };
          infoArr.push(info);
        });
        this.tickerInfoArr = infoArr;
        this.fetchFinish = true;
        console.log(this.tickerInfoArr);
      });
    });
  }

  public removeFromPortfolio(tickerItem) {
    let portfolioArrOld = JSON.parse(localStorage.getItem('Portfolio'));
    let portfolioArrNew = portfolioArrOld.filter(
      (data) => data.ticker != tickerItem.ticker.toUpperCase()
    );
    localStorage.setItem('Portfolio', JSON.stringify(portfolioArrNew));
    this.checkEmpty();
  }

  removeFromTickerInfoArr(tickerItem) {
    let tickerInfoArrNew = this.tickerInfoArr.filter(
      (data) => data.ticker != tickerItem.ticker
    );
    this.tickerInfoArr = tickerInfoArrNew;
  }

  checkEmpty() {
    this.portfolioArr = localStorage.getItem('Portfolio')
      ? JSON.parse(localStorage.getItem('Portfolio'))
      : [];
    if (this.portfolioArr.length) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }

  openTransectionButton(ticker, name, currentPrice, opt) {
    const transModalRef = this.transModalService.open(
      TransactionButtonComponent
    );
    transModalRef.componentInstance.ticker = ticker;
    transModalRef.componentInstance.name = name;
    transModalRef.componentInstance.currentPrice = currentPrice;
    transModalRef.componentInstance.opt = opt;
    transModalRef.result.then((recItem) => {
      if (recItem) {
        console.log(recItem);
        if (recItem.quantity === 0) {
          this.removeFromPortfolio(recItem);
          this.removeFromTickerInfoArr(recItem);
        } else {
          this.checkEmpty();  
          this.tickerInfoArr.forEach((item, i) => {
            if (item.ticker == recItem.ticker) {
              this.tickerInfoArr[i].quantity = recItem.quantity;
              this.tickerInfoArr[i].totalCost = recItem.totalCost;
              this.tickerInfoArr[i].avgCost =
                recItem.totalCost / recItem.quantity;
              this.tickerInfoArr[i].marketValue =
                recItem.quantity * this.tickerInfoArr[i].currentPrice;
              this.tickerInfoArr[i].change =
                this.tickerInfoArr[i].currentPrice -
                recItem.totalCost / recItem.quantity;
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    console.log('Open Portfolio');
    this.fetchAllTicker();

  }

  ngOnDestroy(): void {
    this.fetchSubscribe.unsubscribe(); 
    clearTimeout(this.fetchSubscribe);
    console.log('Exist from Portfolio');
  }
}
