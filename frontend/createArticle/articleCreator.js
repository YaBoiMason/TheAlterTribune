import { Paper, Article } from "./types.js";

const inputElement = document.getElementById("file");

var imageData = null;

window.onload = function()
{
    try{
        if (typeof Storage !== 'undefined') { // We have local storage support
            document.getElementById("articleTitle").value = localStorage.title;
            document.getElementById("authorfield").value = localStorage.author;
            document.getElementById("bodyfield").value = localStorage.body;
            document.getElementById("subtitlefield").value = localStorage.subtitle;
        }
    } catch (e) {
        alert(e);
    }
};

var loadFile = function(event){
    const reader = new FileReader();
    const fileList = this.files;
    console.log("loading file...");
    if(fileList[0].size > 71000){
        document.body.innerHTML = " ";
        document.write("<p>Image is too large.</p>");
    }
    reader.onload = function(){
        imageData = reader.result
        console.log("loaded.");
    }
    reader.readAsDataURL(fileList[0]);
}


inputElement.addEventListener("change", loadFile, false);

document.getElementById("submit").onclick = function(){
    var paper = new Article();
    var title = document.getElementById("articleTitle").value;
    var author = document.getElementById("authorfield").value;
    var body = document.getElementById("bodyfield").value;
    var subtitle = document.getElementById("subtitlefield").value;

    try{
        if (typeof Storage !== 'undefined') { // We have local storage support
            localStorage.title = title;
            localStorage.author = author;
            localStorage.body = body;
            localStorage.subtitle = subtitle;// to save to local storage
        }
    } catch(e)
    {
        alert(e);
    }
            
    paper.title = title;
    paper.author = author;
    paper.body = body;
    paper.subtitle = subtitle;
    paper.year = new Date().getFullYear();
    paper.image = imageData;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://alter.snwy.me/api/postArticle", true);
    xhr.onload = function (e){
        if(xhr.readyState == 4){
            if(xhr.status == 403){
                document.body.innerHTML = "";
                document.write("<p>Something was wrong with your submission. The server says: " + xhr.responseText + "  Please try again! Questions or concerns: email mason@snwy.me</p>");
                document.write(xhr.status);
            } else if (xhr.status == 200) {
                document.body.innerHTML = "";
                document.write("<p>Your article was successfully submitted!</p>");
                document.write(xhr.status);
            } else {
                document.body.innerHTML = "";
                document.write("<p>An unknown error occured. Either you are posting articles too fast, or something went wrong. If it's the latter, please email mason@snwy.me Error code:</p>");
                document.write(xhr.status);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(paper));
    console.log(JSON.stringify(paper));
}
