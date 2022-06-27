import { Host, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { HOST } from './host-name';

import { Metadata } from './metadata';
import { Latestprice } from './latestprice';
import { News } from './news';
import { DailyPrice } from './daily-price';
import { HistPrice } from './hist-price';
import { SearchUtility } from './search-utility';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private searchutilPre = HOST + 'api/v1.0.0/searchutil';
  private metadataPre = HOST + 'api/v1.0.0/metadata';
  private companyPeersPre = HOST + 'api/v1.0.0/companypeers';
  private latestPricePre = HOST + 'api/v1.0.0/latestprice';
  private newsPre = HOST + 'api/v1.0.0/news';
  private dailyChartsPre = HOST + 'api/v1.0.0/dailycharts';
  private histChartsPre = HOST + 'api/v1.0.0/histcharts';
  private sentimentsPre = HOST + 'api/v1.0.0/sentiments';
  private recommendationPre = HOST + 'api/v1.0.0/recommendations';
  private companyEarningsPre = HOST + 'api/v1.0.0/companyearnings';

  constructor(private http: HttpClient) {}

  fetchSearchutil(ticker: string): Observable<SearchUtility[]> {
    const searchutilUrl = `${this.searchutilPre}/${ticker}`;
    return this.http.get<SearchUtility[]>(searchutilUrl).pipe(
      catchError(this.handleError('fetchSearchutil', [])) 
    );
  }

  fetchMetadata(ticker: string): Observable<Metadata> {
    const metaDataUrl = `${this.metadataPre}/${ticker}`;

    return this.http.get<Metadata>(metaDataUrl); 
  }

  fetchCompanyPeers(ticker: string): Observable<any> { 
    const peersUrl = `${this.companyPeersPre}/${ticker}`;
    console.log(peersUrl);
    return this.http.get<any>(peersUrl);
  }

  fetchLatestPrice(ticker: string): Observable<Latestprice> {
    const latestPriceUrl = `${this.latestPricePre}/${ticker}`;
    return this.http.get<Latestprice>(latestPriceUrl);

  }

  fetchNews(ticker: string): Observable<News[]> {
    const newsUrl = `${this.newsPre}/${ticker}`;
    return this.http.get<News[]>(newsUrl);

  }

  fetchDailyCharts(
    ticker: string,
    startDate: string
  ): Observable<DailyPrice[]> {
    const dailyChartsUrl = `${this.dailyChartsPre}/${ticker}/date/${startDate}`;
    return this.http.get<DailyPrice[]>(dailyChartsUrl);

  
  }

  fetchHistCharts(ticker: string, startDate: string): Observable<HistPrice[]> {
    const histChartsUrl = `${this.histChartsPre}/${ticker}/date/${startDate}`;
    return this.http.get<HistPrice[]>(histChartsUrl);

  }

  fetchSentiments(ticker: string): Observable<any>{
    const sentList = `${this.sentimentsPre}/${ticker}`;
    return this.http.get<any>(sentList);
  }

  fetchRecommendations(ticker: string): Observable<any>{
    const recommendList = `${this.recommendationPre}/${ticker}`;
    return this.http.get<any>(recommendList);
  }

  fetchCompanyEarnings(ticker: string): Observable<any>{
    const earningsList = `${this.companyEarningsPre}/${ticker}`;
    return this.http.get<any>(earningsList);
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
