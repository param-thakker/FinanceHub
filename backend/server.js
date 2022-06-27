const express = require('express');
const outerAPI = require('./outerAPI');
const path = require('path');
const cors = require('cors');
const app = express();

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end()
    }
    next();
}

function checkArray(priceRes, tickerName) {
    if (Array.isArray(priceRes)) {
        console.log(`${tickerName} Record length: ${priceRes.length}`);
    } else {
        console.log(`${tickerName} Ticker Not Found`);
    }
}

app.use(ignoreFavicon);
app.use(cors());

app.get('/', (req, res) => {
    return res.send('Stock Search');
})


app.get('/api/v1.0.0/searchutil/:keyword', async function (req, res) {
   
    let apiRes = await outerAPI.autocomplete(req.params.keyword);
    let msg = `${req.params.keyword} Search-utilities finished at ${Date()}\nLength of response: ${apiRes.length}`;
    return res.send(apiRes);
   
})

app.get('/api/v1.0.0/metadata/:tickerName', async function (req, res) {
    let apiRes = await outerAPI.metaData(req.params.tickerName);
    return res.send(apiRes);
  
})


app.get('/api/v1.0.0/latestprice/:tickerName', async function (req, res) { 
    let apiRes = await outerAPI.latestPrice(req.params.tickerName);
    return res.send(apiRes);
})

app.get('/api/v1.0.0/companypeers/:tickerName',async function(req, res) {  
    let apiRes = await outerAPI.companyPeers(req.params.tickerName);
    return res.send(apiRes);
})

app.get('/api/v1.0.0/news/:tickerName', async function (req, res) {
    let apiRes = await outerAPI.newsInfo(req.params.tickerName);
    return res.send(apiRes);
})

app.get('/api/v1.0.0/dailycharts/:tickerName/date/:startDate', async function (req, res) {
    let apiRes = await outerAPI.dailycharts(req.params.startDate, req.params.tickerName);
    checkArray(apiRes, req.params.tickerName.toUpperCase());
    return res.send(apiRes);
})

app.get('/api/v1.0.0/histcharts/:tickerName/date/:startDate', async function (req, res) {
    let apiRes = await outerAPI.histCharts(req.params.startDate, req.params.tickerName);
    checkArray(apiRes, req.params.tickerName.toUpperCase());
    return res.send(apiRes);
})

app.get('/api/v1.0.0/sentiments/:tickerName', async function (req, res) {
    let apiRes = await outerAPI.sentiments(req.params.tickerName);
    return res.send(apiRes);
})

app.get('/api/v1.0.0/recommendations/:tickerName', async function (req, res) {
    let apiRes = await outerAPI.recommendations(req.params.tickerName);
    return res.send(apiRes);
})

app.get('/api/v1.0.0/companyearnings/:tickerName', async function (req, res) {
    let apiRes = await outerAPI.earnings(req.params.tickerName);
    return res.send(apiRes);
})

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist/Frontend')));

app.use('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/Frontend/index.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NodeJS Stock Server listening on port ${PORT}...`);
});



