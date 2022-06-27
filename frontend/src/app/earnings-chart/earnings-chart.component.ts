import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-earnings-chart',
  templateUrl: './earnings-chart.component.html',
  styleUrls: ['./earnings-chart.component.css']
})
export class EarningsChartComponent implements OnInit {

  @Input() earnings:any;
  actual:any = [];
  estimate: any=[];
  surprise: any = [];
  categories:any =[];
  highcharts1 = Highcharts;
  chartOptions1:Highcharts.Options={
    chart: {
      type: 'spline',
      backgroundColor: '#f7f7f7'
    },
    title: {
      text: 'Historical EPS Surprises'
    },
    subtitle : {
       style: {
          position: 'absolute',
          right: '0px',
          bottom: '10px'
       }
    },
    xAxis:[{
       categories: this.categories
    },
    {
      categories: this.surprise
    }
  ]
  ,
    yAxis : {
       title: {
          text: 'Quarterly EPS'
       }
    },
    tooltip : {
       shared: true,
    },
    plotOptions : {
       area: {
          fillOpacity: 0.5
       }
    },
    credits:{
      enabled: false
    },
    series: [
       {
          name: 'Actual',
          data: [],
          type: "spline",
       },
       {
          name: 'Estimate',
          data: [],
          type: "spline",

       },
    ]
  };


  constructor() { }

  ngOnInit(): void {

   console.log(this.earnings)

   this.earnings = this.earnings.map((element: { actual: number | null; estimate: number | null; surprise: number | null; })=>{
      if(element.actual==null){
         element.actual = 0
      }
      if(element.estimate==null){
         element.estimate=0
      }
      if(element.surprise==null){
         element.surprise=0
      }
      return element

   })

   console.log(this.earnings)

    this.earnings.forEach((element: { actual: any; estimate: any; surprise: string; period: string; })=>{
      this.actual.push(element.actual)
      this.estimate.push(element.estimate)
      this.surprise.push(element.surprise)
      this.categories.push(element.period.substring(0,10)+'<br/>Surprise: '+element.surprise)

    })

   this.highcharts1 = Highcharts;
   this.chartOptions1 = {
      chart: {
        type: 'spline',
        backgroundColor: '#f7f7f7'
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      subtitle : {
         style: {
            position: 'absolute',
            right: '0px',
            bottom: '10px'
         }
      },
     
      xAxis:[{
         categories: this.categories
      },
      {
        categories: this.surprise
      }
    ]
    ,
      yAxis : {
         title: {
            text: 'Quarterly EPS'
         }
      },
      tooltip : {
         shared: true,
      },
      plotOptions : {
         area: {
            fillOpacity: 0.5
         }
      },
      credits:{
        enabled: false
      },
      series: [
         {
            name: 'Actual',
            data: this.actual,
            type: "spline",
         },
         {
            name: 'Estimate',
            data: this.estimate,
            type: "spline",
         },
      ]
   };
  }

}
