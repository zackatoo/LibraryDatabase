"use strict";

var resultsContainer;
var query;
var resultsCounter;

var dataNodes = [];

function setup() {
    resultsContainer = document.getElementById("resultsContainer");
    query = document.getElementById("query");
    resultsCounter = document.getElementById("resultsCounter");

    populateDataNodes();
    resultsContainer.removeChild(document.getElementById("loadingMessage"));

    document.getElementById("search").onclick = () => search();
    document.querySelector("#query").addEventListener("keyup", event => {
        if (event.key === "Enter") search();
        event.preventDefault();
    });
}

function search() {
    let queryText = query.value.toLowerCase();

    let results = 0;
    for (let i = 0; i < database.length; i++) {
        if (checkMatch(queryText, database[i])) {
            dataNodes[i].style.display = 'block';
            results++;
        } else {
            dataNodes[i].style.display = 'none';
        }
    }

    updateResultsCounter(results);
}

function updateResultsCounter(results) {
    resultsCounter.innerHTML = results + " results";
}

function checkMatch(queryText, entry) {
    if (queryText == "") return true;

    if (entry.title.toLowerCase().includes(queryText)) return true;
    if (entry.author.toLowerCase().includes(queryText)) return true;
    if (entry.illistrator != undefined && entry.illistrator.toLowerCase().includes(queryText)) return true;
    if (entry.series != undefined && entry.series.toLowerCase().includes(queryText)) return true;
    if (entry.obtained != undefined && entry.obtained.toLowerCase().includes(queryText)) return true;

    return false;
}

function populateDataNodes() {
    // Creates an HTML node for every entry in the database variable
    for (let i = 0; i < database.length; i++) {
        dataNodes[i] = createDataNode(database[i]);
        resultsContainer.appendChild(dataNodes[i]);
    }
    updateResultsCounter(database.length);
}

function createDataNode(entry) {
    // Creates an HTML node for the database entry provided
    let wrapper = document.createElement("div");
    wrapper.classList.add("entry");

    let seriesIndex = document.createElement("div");
    seriesIndex.classList.add("seriesIndex");

    let seriesNO = document.createElement("p");
    let numberText = "-";
    if (entry.seriesNO != undefined) {
        numberText = entry.seriesNO;
    }
    seriesNO.appendChild(document.createTextNode(numberText));
    seriesNO.classList.add("seriesNO");
    seriesIndex.appendChild(seriesNO);
    wrapper.appendChild(seriesIndex);

    let info = document.createElement("div");
    info.classList.add("info");

    let title = document.createElement("p");
    title.appendChild(document.createTextNode(entry.title));
    title.classList.add("title");
    info.appendChild(title);

    let smallText = "";

    if (entry.series != undefined && entry.series != entry.title) {
        smallText = "The " + entry.series + " Series - ";
    }

    let authors = document.createElement("p");
    smallText += "By " + entry.author;
    if (entry.illistrator != undefined) {
        smallText += " and " + entry.illistrator;
    }
    authors.appendChild(document.createTextNode(smallText));
    authors.classList.add("authors");
    info.appendChild(authors);

    wrapper.appendChild(info);
    return wrapper;
}