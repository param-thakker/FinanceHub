import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html'
})
export class MyPortfolioComponent implements OnInit {

  @Input() portfolioElement: any;
  @Output("modifyPortfolio") modifyPortfolio: EventEmitter<any>= new EventEmitter<any>();

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.portfolioElement);
  }

  sellStock(data: any){
    this.modifyPortfolio.emit(data);
  }

  openFormModal($event: { stopPropagation: () => void; }, operationType: any) {
    $event.stopPropagation();
    const modalRef = this.modalService.open(TransactionModalComponent);
    modalRef.componentInstance.portfolioElement = this.portfolioElement;
    modalRef.componentInstance.operationType = operationType;
    modalRef.result.then((result) => {
      result['operationType'] = operationType;
      result['ticker'] = this.portfolioElement['ticker'];
      result['currentPrice'] = this.portfolioElement['c'];
      result['prevQty'] = this.portfolioElement['quantity'];
      result['prevTotal'] = this.portfolioElement['totalAmount'];
      result['prevAverageRate'] = this.portfolioElement['avgPrice'];
      result['name'] = this.portfolioElement['name'];
      this.sellStock(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  navigateToDetailsPage(ticker: string) {
    this.router.navigateByUrl('/search/'+ticker);
  }

}
