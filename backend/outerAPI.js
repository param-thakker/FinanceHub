const fetch = require('node-fetch');
const async = require('express-async-await');
const url = require('url');
const https = require('https');
const moment=require('moment-timezone');
const HttpsProxyAgent = require('https-proxy-agent');  

const FinnhubAPIKey='c88o76qad3ia349rhflg';
module.exports.autocomplete = autocomplete;
module.exports.metaData = metaData;
module.exports.companyPeers = companyPeers;
module.exports.latestPrice = latestPrice;
module.exports.newsInfo = newsInfo;
module.exports.dailycharts = dailycharts;
module.exports.histCharts = histCharts;
module.exports.sentiments = sentiments;
module.exports.recommendations = recommendations;
module.exports.earnings = earnings;


async function autocomplete(keyword) {
    let url=`https://finnhub.io/api/v1/search?q=${keyword}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let searchRes = await APIresult.json();
    let resArr=[];
    let res=searchRes.result;
    if(res != null && res != undefined){
        for (i=0;i<res.length;i++){
            if (res[i].type==="Common Stock" && !res[i].symbol.includes(".")){
                resArr.push(res[i]);
            }
        }
    }
    
    return resArr;
}


async function metaData(tickerName) {
    let url=`https://finnhub.io/api/v1/stock/profile2?symbol=${tickerName}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let metaDataRes = await APIresult.json();
    console.log(metaDataRes);
    return metaDataRes;
}


async function latestPrice(tickerName) {
    
    let url=`https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let latestPriceRes = await APIresult.json();
    if (latestPriceRes.length === 0) {
        return {"detail": "Not found."};
    } else {
        return latestPriceRes; 
    }
}
async function companyPeers(tickerName){
    let url=`https://finnhub.io/api/v1/stock/peers?symbol=${tickerName}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let compPeers= await APIresult.json();
    console.log(compPeers);
    return compPeers;
}

async function newsInfo(keyword) {
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let currentLATime=moment().tz("America/Los_Angeles").format('YYYY-MM-DD');

    const toUnixTimestamp = new Date(currentLATime).getTime() / 1000;
    var result = new Date(toUnixTimestamp);//new Date(Date.now());
   
    result.setDate(result.getDate() -30);
    let from=result.toLocaleString().substring(0,9);
    let l=from.split("/");
    if (l[1].length==1){
        l[1]="0"+l[1];
    }
    let fromDate=l[2].split(",")[0]+"-"+months[Number(l[0])-1]+"-"+l[1];
    console.log('fromDate:', fromDate);
    console.log('toDate:',currentLATime);
    let url=`https://finnhub.io/api/v1/company-news?symbol=${keyword}&from=${fromDate}&to=${currentLATime}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIres = await fetch(url, {method: 'GET', headers: headers});
    let response = await APIres.json();
    let newsFinal = [];

    for(var res in response){
        let curr = response[res];
        if(curr.image != '' && curr.headline != ''){
            console.log("inserted",curr)
            newsFinal.push(curr);
        }
        if(newsFinal.length == 20){
            return newsFinal;
        }
    }
    return newsFinal;
}

async function dailycharts(toDate, tickerName) {
  
    const toDateDivide=parseInt((toDate/1000).toFixed());
    const fromUnixTimestamp = (toDateDivide-21600);
     let url=`https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=5&from=${fromUnixTimestamp}&to=${toDateDivide}&token=${FinnhubAPIKey};`;
     let headers = {'Content-Type': 'application/json'};
     let APIresult = await fetch(url, {method: 'GET', headers: headers});
     let dailyPriceRes = await APIresult.json();
     return dailyPriceRes;
 }

async function histCharts(startDate, tickerName) {
    let currentLATime=moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
    const toUnixTimestamp = new Date(currentLATime).getTime() / 1000;
    const prevDate = new Date(startDate);
    const fromUnixTimestamp = Math.floor(prevDate.getTime() / 1000);
    let url=`https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=D&from=${fromUnixTimestamp}&to=${toUnixTimestamp}&token=${FinnhubAPIKey};`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let histRes = await APIresult.json();
    return histRes;
}

async function sentiments(tickerName){
    let url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${tickerName}&from=2022-01-01&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let senti = await APIresult.json();
    return senti;
}
async function recommendations(tickerName){
    let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${tickerName}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let recomm = await APIresult.json();
    return recomm;
}

async function earnings(tickerName){
    let url = `https://finnhub.io/api/v1/stock/earnings?symbol=${tickerName}&token=${FinnhubAPIKey}`;
    let headers = {'Content-Type': 'application/json'};
    let APIresult = await fetch(url, {method: 'GET', headers: headers});
    let earn = await APIresult.json();
    return earn;
}

