import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-watchlist-cards',
  templateUrl: './watchlist-cards.component.html',
  styleUrls: ['./watchlist-cards.component.css']
})
export class WatchlistCardsComponent implements OnInit {
  @Input() watchlistElement: any;
  @Output("removeFromWatchlist") removeFromWatchlist: EventEmitter<any>= new EventEmitter<any>();
  public colorSelected: string = "black";
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.watchlistElement['d'] > 0){
      this.colorSelected = "green";
    }
    else if (this.watchlistElement['d'] < 0){
      this.colorSelected = "red";
    }
    else {
      this.colorSelected = "black";
    }
  }

  onSubmit(ticker:any, $event: { stopPropagation: () => void; }){
    $event.stopPropagation();
    this.removeFromWatchlist.emit(ticker);
  }

}
