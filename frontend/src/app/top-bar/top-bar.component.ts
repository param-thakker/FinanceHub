import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private router: Router) {
   }

  navigatetoURL(){
    let lastTicker = localStorage.getItem('lastTicker') || '';
    if(lastTicker != ''){
      this.router.navigateByUrl('/search/' + lastTicker);
      // window.location.href = '/search/lastTicker';
    }
    else{ 
      this.router.navigateByUrl('/');
    }

  }

  ngOnInit() {
  }

}
