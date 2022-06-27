import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { switchMap, debounceTime, tap, finalize, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { SearchUtility } from '../search-utility';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent implements OnInit {
  filteredCompanies: SearchUtility[] = [];
  searchForm: FormGroup;
  isLoading = false;
  ticker: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private backService: BackendService
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({ tickerInput: '' });
    // console.log("search-form");
    this.searchForm
      .get('tickerInput')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>{
          console.log("checking "+value+"-")
          return  this.backService
              .fetchSearchutil(value)
              .pipe(finalize(() => (this.isLoading = false)))
          }
        )
      )
      .subscribe((companies) => {
        let value =this.searchForm.get('tickerInput').value;
        if(value != null)
          this.filteredCompanies = companies
        else 
          this.filteredCompanies = [];
      });
  }

  onSubmit(tickerData) {
    if (tickerData.tickerInput.displaySymbol) {
      this.ticker = tickerData.tickerInput.displaySymbol;
    } else {
      this.ticker = tickerData.tickerInput;
    }
    console.log('ticker name in form: ', this.ticker);
    this.router.navigateByUrl('/search/' + this.ticker);
    this.searchForm.reset();
  }
  resetForm(){
    this.router.navigateByUrl('/');
    // window.location.href = "/";
  }

  // onSelected()
  // tickerChange(event){
  //   console.log(event.value);
  // }

  onSelect(value){ //
    console.log(value.displaySymbol);
    this.router.navigateByUrl('search/' + value.displaySymbol);
    this.searchForm.reset();
  }

  displayFn(company: SearchUtility) {
    if (company) {
      return company.displaySymbol;
    }
  }
}
