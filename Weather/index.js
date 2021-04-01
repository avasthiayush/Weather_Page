const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html" , "utf-8");
const replaceVal = (tempVal , orgVal) =>{
    let temp = tempVal.replace("{% tempVal %}" , Math.floor(orgVal.main.temp - 273));
    temp = temp.replace("{% location %}" , orgVal.name);
    temp = temp.replace("{% country %}" , orgVal.sys.country );
    temp = temp.replace("{% tempMin %}" , Math.floor(orgVal.main.temp_min - 273));
    temp = temp.replace("{% tempMax %}" , Math.floor(orgVal.main.temp_max - 273));
    temp = temp.replace("{% tempStatus %}" , orgVal.weather[0].main);
    
    return temp;
}
const server = http.createServer((req , res) => {
    if(req.url == "/"){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=77e7905bf11dfd3daff6dce7d05f8535')
        .on('data', (chunk)  => {
            let objDATA = JSON.parse(chunk);
            // res.end(objDATA);
            let arrDATA = [objDATA]
            // console.log(arrDATA[0].main.temp);
            const real = arrDATA.map((val) => replaceVal(homeFile , val)).join("");
            res.write(real);
            // console.log(real);
        })
        .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
    }
});
server.listen(3000,"127.0.0.1");