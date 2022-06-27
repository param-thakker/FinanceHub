import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  @Input() sentiment: any;
  @Input() recommendation:any;
  @Input() name:any;
  @Input() earnings:any;
  totalMentionsR:number =0;
  positiveMentionsR:number=0;
  negativeMentionsR:number=0;
  totalMentionsT:number=0;
  positiveMentionsT:number=0;
  negativeMentionsT:number=0;

  constructor() { }

  ngOnInit(): void {
    console.log('Insight component', this.sentiment);
    this.sentiment['reddit'].forEach((element: { [x: string]: number; }) => {
      this.totalMentionsR+=element['mention']
      this.positiveMentionsR+=element['positiveMention']
      this.negativeMentionsR+=element['negativeMention']
    });

    this.sentiment['twitter'].forEach((element: { [x: string]: number; }) => {
      this.totalMentionsT+=element['mention']
      this.positiveMentionsT+=element['positiveMention']
      this.negativeMentionsT+=element['negativeMention']
    });


  }

  ngOnChanges(){

  }

}
