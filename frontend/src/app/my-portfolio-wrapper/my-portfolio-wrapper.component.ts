import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";
import {Subject} from "rxjs";

import { BackendService as ApiCallService } from '../backend.service';

@Component({
  selector: 'app-my-portfolio-wrapper',
  templateUrl: './my-portfolio-wrapper.component.html'
})
export class MyPortfolioWrapperComponent implements OnInit {

  public portfolioList: any;
  public allTickers: any;
  public stockData: any = undefined;
  public noPortfolioAlert = true;
  public moneyFromStorage: any;
  alertColor1='';
  boughtMessage = '';
  private _success1 = new Subject<string>();
  boughtTicker ='';

  public changeBoughtMessage() {
    this.alertColor1 = "success";
    this._success1.next(`${this.boughtTicker} bought successfully.`);
  }
  public changeSoldMessage() {
    this.alertColor1 = "danger";
    this._success1.next(`${this.boughtTicker} sold successfully.`);
  }


  constructor(private router: Router, private apiCall: ApiCallService) {
  }


  ngOnInit(): void {
    if(localStorage.getItem('Portfolio') != undefined && localStorage.getItem('Portfolio') != '[]'){
      console.log(localStorage.getItem('Portfolio'));
      this.portfolioList = JSON.parse(localStorage.getItem('Portfolio')|| '{}').sort();
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      this.getDetails();
      this.noPortfolioAlert = false;

    }
    else{
      this.portfolioList = [];
      this.noPortfolioAlert = true;
    }
    if(localStorage.getItem('money')!=undefined){
      this.moneyFromStorage=parseFloat(localStorage.getItem('money')|| '{}')
    }
    else{
      this.moneyFromStorage=25000
      localStorage.setItem('money',this.moneyFromStorage.toString())
    }

    this._success1.subscribe(message => this.boughtMessage = message);
    this._success1.pipe(
      debounceTime(5000)
    ).subscribe(() => this.boughtMessage = '');

  }

  modifyPortfolio(data:any){
    if(data.operationType == "Buy"){
      console.log("Buy Function called");
      console.log(data);
      this.addToPortfolio(data);
    }
    else if(data.operationType == "Sell"){
      console.log("Sell Function called");
      console.log(data);
      this.removeFromPortfolio(data);
    }
    else{
      console.log("Error")
    }
  }

  addToPortfolio(data:any){
    this.portfolioList = this.portfolioList.filter((item: { [x: string]: any; }) => item['ticker'] != data['ticker']);
    let newAmount = parseFloat((data['prevTotal'] + data['quantity'] * data['currentPrice']).toFixed(3));
    let newQty = data['quantity'] + data['prevQty'];
    this.boughtTicker=data['ticker'];
    let newElement = {'ticker': data['ticker'], 'name': data['name'], 'quantity': newQty, 'totalCost': newAmount};
    this.portfolioList.push(newElement);
    this.moneyFromStorage-=data['quantity']*data['currentPrice'];
    localStorage.setItem('money',this.moneyFromStorage.toString())
    localStorage.setItem('Portfolio', JSON.stringify(this.portfolioList));
    this.changeBoughtMessage();
    this.getDetails();
  }



  removeFromPortfolio(data:any){
    // partial selling
    this.portfolioList = this.portfolioList.filter((item: { [x: string]: any; }) => item['ticker'] != data.ticker);
    let newQty = data['prevQty'] - data['quantity'] ;
    let overallPL = parseFloat((data['quantity'] * data['currentPrice']).toFixed(2)) - parseFloat((data['quantity'] * data['prevAverageRate']).toFixed(2));
    console.log(overallPL);
    if(newQty > 0){
      let newAmount = parseFloat((data['prevTotal'] - (data['quantity'] * data['prevAverageRate'])).toFixed(3));
      let newElement = {'ticker': data['ticker'], 'name': data['name'], 'quantity': newQty, 'totalCost': newAmount};
      this.portfolioList.push(newElement);
    }
    else if(newQty == 0){
      console.log("All stocks are sold.");
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      if(this.portfolioList.length > 0){
        this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      }
      else{
        this.noPortfolioAlert = true;
      }
    }
    else{
      console.error("You cannot sell the stocks which you don not have");
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      if(this.portfolioList.length > 0){
        this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      }
      else{
        this.noPortfolioAlert = true;
      }
    }
    console.log(data['currentPrice']);
    this.moneyFromStorage+=data['quantity']*data['currentPrice'];
    localStorage.setItem('money',this.moneyFromStorage.toString())
    localStorage.setItem('Portfolio', JSON.stringify(this.portfolioList));
    this.boughtTicker=data['ticker'];
    this.changeSoldMessage();

    console.log(overallPL);
    // Make API call to fetch
    this.getDetails();
  }

  getDetails(){
    let temp: any[] = []
    if(this.portfolioList != []){
      this.portfolioList.forEach((element) => {

        this.apiCall.fetchLatestPrice(element.ticker).subscribe((data: any) => {
          console.log(data);
          console.log(element);
        // for(let i = 0; i< data.length; i++){
          // let ele = this.portfolioList.filter((item: { ticker: any; }) => item.ticker == data['ticker'])[0]
          // console.log(ele);
          data['ticker'] = element.ticker;
          data['name'] = element.name; //ele['name'];
          data['quantity'] = element.quantity;//ele['qty'];
          data['totalAmount'] = element.totalCost; //ele['totalAmount'];
          data['avgPrice'] = parseFloat((element.totalCost/element.quantity).toFixed(3));
          data['currentTotal'] = parseFloat((data['c'] * element.quantity).toFixed(3));
          data['currentDifference'] = parseFloat((data['c'] - data['avgPrice']).toFixed(3));
          data['currentPrice'] = parseFloat((data['c']).toFixed(3));
          if(data['currentDifference'] > 0){
            data['colorElement'] = 'green';
          }
          else if(data['currentDifference'] < 0){
            data['colorElement'] = 'red';
          }
          else{
            data['colorElement'] = 'black';
          }
          console.log(data);
          temp.push(data);
          console.log(temp);
          this.stockData = temp;
        // }
        // this.stockData = temp;
      });

      });
      //console.log(temp);
      //this.stockData = temp;
    }
    else{
      console.log("You don't have any stocks.");
      this.stockData = [];
      this.noPortfolioAlert = true;
    }
  }

}
