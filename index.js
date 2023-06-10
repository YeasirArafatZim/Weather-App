// https://api.openweathermap.org/data/2.5/weather?q=bogra&appid=ee08f1446cee98acb518e94b88612804 

const http = require('http');
const fs = require('fs');
const requests= require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');
const homeCss = fs.readFileSync('home.css', 'utf-8');

const kelToCel = (kel) => Math.round(kel-273.15);

const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace('{%tempVal%}', kelToCel(orgVal.main.temp));
    temperature = temperature.replace('{%tempMin%}', kelToCel(orgVal.main.temp_min));
    temperature = temperature.replace('{%tempMax%}', kelToCel(orgVal.main.temp_max));
    temperature = temperature.replace('{%city%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    return temperature;
}

const server = http.createServer((req, res)=>{
    if(req.url == '/'){
        requests('https://api.openweathermap.org/data/2.5/weather?q=bogra&appid=ee08f1446cee98acb518e94b88612804')
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk); 
            const arrData = [objData];
            console.log(objData);

            const realTimeData = arrData.map(val=>replaceVal(homeFile, val)).join("") ;

            res.write(realTimeData);
        })
        .on('end', (err)=>{
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
    else if(req.url == '/home.css'){
        res.end(homeCss);
    }
})

server.listen('8000', '127.0.0.1');
