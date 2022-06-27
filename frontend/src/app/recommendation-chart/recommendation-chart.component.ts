import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-recommendation-chart',
  templateUrl: './recommendation-chart.component.html',
  styleUrls: ['./recommendation-chart.component.css']
})
export class RecommendationChartComponent implements OnInit {

  @Input() recommendation:any;
  strongBuyVals:any = [];
  buyVals:any = [];
  holdVals:any = [];
  sellVals:any =[];
  strongSellVals:any= [];
  months:any=[];
  highcharts1 = Highcharts;
//   highcharts: any;
  chartOptions1:Highcharts.Options={
    chart: {
      type: 'column',
      backgroundColor: '#f7f7f7'
   },
   colors:['#176f37','#1db954','#b98b1d','#f45b5b','#813131'],
   title: {
      text: 'Recommendation Trends'
   },
   // legend : {
   //    layout: 'vertical',
   //    align: 'right',
   //    verticalAlign: 'top',
   //   //  x: 250,
   //   y: 20,
   //    floating: true,
   //    borderWidth: 1,

   //    backgroundColor: ('#FFFFFF'), shadow: true
   // },
   xAxis:{
      categories: this.months, title: {
         text: null
      }
   },
   yAxis : {
      min: 0,
      title: {
         text: '#Analysis',
         align: 'high'
      },
      labels: {
         overflow: 'justify'
      }
   },
   tooltip : {
      // valueSuffix: ' millions'
   },
   plotOptions : {
      column: {
         dataLabels: {
            enabled: true
         }
      },
      series: {
         stacking: 'normal'
      }
   },
   credits:{
      enabled: false
   },
   series: [
      {
         name: 'Strong Buy',
         data: [],
         type:"column"
         // data: [1,2,3,4]
      },
      {
         name: 'Buy',
         data: [],
         type:"column"
         // data: [1,2,3,4]
      },
      {
         name: 'Hold',
         data: [],
         type:"column"
         // data: [1,2,3,4]
      },
      {
         name: 'Sell',
         data: [],
         type:"column"
         // data: [1,2,3,4]
      },
      {
         name: 'Strong Sell',
         data: [],
         type:"column"
         // data: [1,2,3,4]
      }
   ]
  };


  constructor() { }




  ngOnInit(): void {

    this.recommendation.forEach((element: { strongBuy: any; buy: any; hold: any; sell: any; strongSell: any; period: string; })=>{
      this.strongBuyVals.push(element.strongBuy)
      this.buyVals.push(element.buy)
      this.holdVals.push(element.hold)
      this.sellVals.push(element.sell)
      this.strongSellVals.push(element.strongSell)
      this.months.push(element.period.substring(0,7))
    })

    this.highcharts1 = Highcharts;

    this.chartOptions1={
      chart: {
        type: 'column',
        backgroundColor: '#f7f7f7'
     },
     colors:['#176f37','#1db954','#b98b1d','#f45b5b','#813131'],
     title: {
        text: 'Recommendation Trends'
     },
     // legend : {
     //    layout: 'vertical',
     //    align: 'right',
     //    verticalAlign: 'top',
     //   //  x: 250,
     //   y: 20,
     //    floating: true,
     //    borderWidth: 1,

     //    backgroundColor: ('#FFFFFF'), shadow: true
     // },
     xAxis:{
        categories: this.months, title: {
           text: null
        }
     },
     yAxis : {
        min: 0,
        title: {
           text: '#Analysis',
           align: 'high'
        },
        labels: {
           overflow: 'justify'
        }
     },
     tooltip : {
        // valueSuffix: ' millions'
     },
     plotOptions : {
        column: {
           dataLabels: {
              enabled: true
           }
        },
        series: {
           stacking: 'normal'
        }
     },
     credits:{
        enabled: false
     },
     series: [
        {
           name: 'Strong Buy',
           data: this.strongBuyVals,
           type:"column"
           // data: [1,2,3,4]
        },
        {
           name: 'Buy',
           data: this.buyVals,
           type:"column"
           // data: [1,2,3,4]
        },
        {
           name: 'Hold',
           data: this.holdVals,
           type:"column"
           // data: [1,2,3,4]
        },
        {
           name: 'Sell',
           data: this.sellVals,
           type:"column"
           // data: [1,2,3,4]
        },
        {
           name: 'Strong Sell',
           data: this.strongSellVals,
           type:"column"
           // data: [1,2,3,4]
        }
     ]
    };


  }

  ngOnChanges(){




  }

}
