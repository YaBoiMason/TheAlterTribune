const schedule = require('node-schedule');
const express = require('express');
const { Paper, Article } = require("./types.js");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const racist = require('racist');
const rateLimit = require("express-rate-limit");
const fs = require('fs');
const spamcheck = require('spam-detection');

var issue = 0;

var possibleArticles = [];

var todaysPaper;

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
app.use(cors());
app.use(bodyParser.json({limit: '500kb'}));

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get('/getArticles', function (req, res) {
    return res.send(JSON.stringify(todaysPaper));
});

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    statusCode: 403
});

app.use(limiter);

function generatePaper(){
    todaysPaper = new Paper();
    todaysPaper.leftArticle = new Article();
    todaysPaper.centerArticle = new Article();
    todaysPaper.rightArticle = new Article();
    todaysPaper.leftArticle.body = "Missing articles, consider creating one!";
    todaysPaper.centerArticle.body = "Missing articles, consider creating one!";
    todaysPaper.rightArticle.body = "Missing articles, consider creating one!";
    todaysPaper.date = new Date().toLocaleDateString("en-US", options);
    if(possibleArticles.length >= 3 && new Date().getHours == 12 || new Date().getHours == 0){
        issue++;
    }
    todaysPaper.issue = issue;
    if(new Date().getHours() >= 12){
        todaysPaper.edition = "nightly";
        console.log(new Date().getHours());
    } else {
        todaysPaper.edition = "daily";
    }
    if(possibleArticles.length >= 3)
    {
        var leftArticleIndex = 0;
        var centerArticleIndex = 0;
        var rightArticleIndex = 0;
        while(leftArticleIndex == centerArticleIndex &&
            leftArticleIndex == rightArticleIndex &&
            centerArticleIndex == rightArticleIndex)
            {
                leftArticleIndex = randomIntFromInterval(0, possibleArticles.length);
                centerArticleIndex = randomIntFromInterval(0, possibleArticles.length);
                rightArticleIndex = randomIntFromInterval(0, possibleArticles.length);
            }
        todaysPaper.leftArticle = possibleArticles[leftArticleIndex];
        todaysPaper.centerArticle = possibleArticles[centerArticleIndex];
        todaysPaper.rightArticle = possibleArticles[rightArticleIndex];
        console.log("enough articles");
    } else 
    {
        switch(possibleArticles.length)
        {
            case 1:
                todaysPaper.centerArticle = possibleArticles[0];
            case 2:
                todaysPaper.leftArticle = possibleArticles[0];
                todaysPaper.centerArticle = possibleArticles[1];
        }
        console.log("not enough articles");
    }

    fs.writeFileSync("articles.json", JSON.stringify(possibleArticles), 'utf8');
}

//generate paper
schedule.scheduleJob('0 0 * * *', () => { 
    generatePaper();
    console.log("morning paper");
});
schedule.scheduleJob('0 12 * * *', () => { 
    generatePaper();
    console.log("nightly paper");
});

schedule.scheduleJob('* * * * *', () => { 
    if(possibleArticles.length <= 3){
        generatePaper();
    }
});

function streamToString (stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
  }

app.post('/postArticle', function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    console.log(req.body);
    var respArticle = req.body;
    if(respArticle.title.length == 0 || respArticle.author.length == 0 || respArticle.subtitle.length == 0 || respArticle.body.length == 0){
        console.log("submission too small!");
        res.status = 403;
        return res.send("Empty submissions not allowed.");
    }
    if(respArticle.title.length > 20 || respArticle.author.length > 15 || respArticle.subtitle.length > 30 || respArticle.body.split(' ').length > 2000){
        console.log("submission too large!");
        res.status = 403;
        return res.send("One or more fields were too long.");
    }
    if(racist().test(respArticle.title) || racist().test(respArticle.author) || racist().test(respArticle.subtitle)){
        console.log("racist submission!");
        res.status = 403;
        return res.send("Detected as racisim.");
    }
    respArticle.body.split(' ').forEach(function (item){
        if(racist().test(item)){
            console.log("racist submission!");
            res.status = 403;
            return res.send("Detected as racisim.");
        }
    });
    possibleArticles.push(respArticle);
    console.log("good article!");
    fs.writeFileSync("articles.json", JSON.stringify(possibleArticles), 'utf8');
    res.sendStatus(200);
});

if (fs.existsSync("articles.json")) {
    possibleArticles = JSON.parse(fs.readFileSync("articles.json"));
}

generatePaper();

app.listen(8082, '0.0.0.0');
console.log("Listening on " + 8082);
