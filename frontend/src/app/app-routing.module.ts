import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from "./details/details.component";
import { WatchlistComponent } from "./watchlist/watchlist.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";
import { SearchFormComponent } from "./search-form/search-form.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { MyPortfolioWrapperComponent } from "./my-portfolio-wrapper/my-portfolio-wrapper.component";
import {WatchlistWrapperComponent } from "./watchlist-wrapper/watchlist-wrapper.component";

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search/:ticker', component: DetailsComponent },
  { path: 'watchlist', component: WatchlistWrapperComponent },
  { path: 'portfolio', component: MyPortfolioWrapperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
