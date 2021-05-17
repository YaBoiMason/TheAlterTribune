import { Paper, Article } from "./types.js";

var paperJson;
var paper = new Paper();

function getPaper(){
    const Http = new XMLHttpRequest();
    const url='https://alter.snwy.me/api/getArticles';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            paperJson = Http.responseText;
            console.log(paperJson);
            paper = JSON.parse(paperJson);
            try{
              document.getElementsByClassName("belowTitleText")[0].innerHTML = paper.date + ', Issue #' + paper.issue + ', ' + paper.edition + " edition.";
              document.getElementById("headline").innerHTML = paper.centerArticle.title;
              document.getElementById("leftHeadline").innerHTML = paper.leftArticle.title;
              document.getElementById("rightHeadline").innerHTML = paper.rightArticle.title;
              document.getElementById("leftSub").innerHTML = paper.leftArticle.subtitle + ' <br>Article by ' + paper.leftArticle.author;
              document.getElementById("rightSub").innerHTML = paper.rightArticle.subtitle + ' <br>Article by ' + paper.rightArticle.author;
              document.getElementById("midSub").innerHTML = paper.centerArticle.subtitle + '  <br>Article by ' + paper.centerArticle.author;
              document.getElementById("leftBody").innerHTML = paper.leftArticle.body;
              document.getElementById("centerBody").innerHTML = paper.centerArticle.body;
              document.getElementById("rightBody").innerHTML = paper.rightArticle.body;
              if(paper.leftArticle.image != null){
                var image = new Image();
                image.src = paper.leftArticle.image;
                document.getElementById("leftImage").appendChild(image);
              } else {
                console.log("null image.");
              }
              if(paper.centerArticle.image != null){
                var image = new Image();
                image.src = paper.centerArticle.image;
                document.getElementById("centerImage").appendChild(image);
              }else {
                console.log("null image.");
              }
              if(paper.rightArticle.image != null){
                var image = new Image();
                image.src = paper.rightArticle.image;
                document.getElementById("rightImage").appendChild(image);
              }else {
                console.log("null image.");
              }
            } catch(err) {
              console.log(err + " happened. Likely somebody submitted an article containing empty fields!");
            }
        }
    }
}

getPaper();
