import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html'
  // styleUrls: ['./transaction-modal.component.css']
})
export class TransactionModalComponent implements OnInit {
  @Input() portfolioElement!: { [x: string]: number; };
  @Input() operationType: any;
  @Input() rightNow:any;
  myForm: FormGroup;
  public money: any;
  stockError: boolean =false;
  moneyError:boolean=false;
  maxStock:any;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder
  ) {
  }



  checkStockError(val:any){
    console.log(this.portfolioElement);
    console.log(val);
    
    if(this.portfolioElement['quantity']<val) this.stockError=true;
    else this.stockError=false;
  }

  checkMoneyError(val:any){
    if((this.money/this.portfolioElement['c'])<val) this.moneyError=true;
    else this.moneyError=false;
  }

  private createForm(portfolio:any) {
    if (this.operationType == 'Buy'){
      this.myForm = this.formBuilder.group({
        quantity: [0, [Validators.required, Validators.min(1), Validators.max(Math.floor(this.money /this.portfolioElement['c']))]]
      });
    }
    else{
      this.myForm = this.formBuilder.group({
        quantity: [0, [Validators.required, Validators.min(1), Validators.max(portfolio['quantity'])]]
      });
    }
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

  ngOnInit(): void {
    console.log(this.portfolioElement);
    this.money = parseFloat(localStorage.getItem('money') || '{}')
    this.createForm(this.portfolioElement);
    this.maxStock = Math.floor(this.money /this.portfolioElement['c'])
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
