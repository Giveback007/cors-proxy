import './init';

import express from 'express';
import cors from 'cors';
import { nullOrEmpty } from './util';
import puppeteer from 'puppeteer';


const app = express();
app.use(cors({ origin: env.allowedCors }));
app.use(express.json());



app.all('/cors', async (req, res) => {
    const { url: _url } = req.query;
    if (!_url) return res.status(400).json({ error: 'No "url" parameter provided' });
    
    try {
        const url = String(_url);
        
        const apiResponse = await fetch(url, {
            method: req.method,
            headers: JSON.parse(JSON.stringify(req.headers)),
            body: nullOrEmpty(req.body) ? undefined : JSON.stringify(req.body)
        });

        // Forward the response from the API to the client
        const data = await apiResponse.json(); // Use .json() if the response is JSON
        return res.send(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/cors/meetup-gql2-payload', async (_, res) => {
    log('getMeetupEventsPayload')
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on('request', async (request) => {        
        if (request.url().includes('gql2')) {
            const payload = await request.fetchPostData();
            if (payload) {
                const payloadJson = JSON.parse(payload);
                if (payloadJson.operationName === "recommendedEventsWithSeries") {
                    browser.close();
                    res.send(payloadJson)
                }
            }
        }
    });

    try {
        await page.goto('https://www.meetup.com/find/?sortField=DATETIME&source=EVENTS');
        await page.waitForSelector('#event-distance-filter-drop-down');
        await page.click('#event-distance-filter-drop-down');
        await page.waitForSelector('#event-distance-100-miles-option');
        await page.click('#event-distance-100-miles-option');
    } catch (err) {
        if (!res.closed) res.status(500).json({ error: err.message });
    }
})


app.listen(3000, () => log(`Listening on port 3000`));

