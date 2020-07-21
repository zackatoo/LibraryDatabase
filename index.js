"use strict";

var resultsContainer;
var query;
var resultsCounter;
var loadingMessage;

var filters;
var sorters = {activeSorter:"author", isReversed:true};

var dataNodes = [];

function setup() {
    resultsContainer = document.getElementById("resultsContainer");
    query = document.getElementById("query");
    resultsCounter = document.getElementById("resultsCounter");

    populateDataNodes();
    loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "none";

    filters = document.getElementById("filters");
    filters.style.display = "none";
    document.getElementById("filter").onclick = () => {
        if (filters.style.display == "none") {
            filters.style.display = "block";
        } else {
            filters.style.display = "none";
        }
    }
    document.querySelector("#query").addEventListener("keyup", event => {
        search();
        event.preventDefault();
    });

    sorters.title = document.getElementById("titleSorter");
    sorters.title.onclick = () => activateSorter("title");
    sorters.author = document.getElementById("authorSorter");
    sorters.author.onclick = () => activateSorter("author");
    sorters.series = document.getElementById("seriesSorter");
    sorters.series.onclick = () => activateSorter("series");

    updateSorter(sorters.title, "title");
    updateSorter(sorters.author, "author");
    updateSorter(sorters.series, "series");
    sort();
}

function search() {
    let queryText = query.value.toLowerCase();

    let results = 0;
    for (let i = 0; i < database.length; i++) {
        if (checkMatch(queryText, database[i])) {
            dataNodes[database[i].id].style.display = "block";
            results++;
        } else {
            dataNodes[database[i].id].style.display = "none";
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

function activateSorter(sorter) {
    // When a sorter is clicked, the GUI needs to be updated before actual sorting is done

    // sorterElement is the DOM node for the div
    if (sorter == sorters.activeSorter) {
        // Reverse the order
        sorters.isReversed = !sorters.isReversed;
    } else {
        // Move to the new sorter
        sorters.isReversed = true;
        sorters.activeSorter = sorter;
    }

    updateSorter(sorters.title, "title");
    updateSorter(sorters.author, "author");
    updateSorter(sorters.series, "series");

    sort();
}

function updateSorter(sorterElement, sorter) {
    let capitalized = sorter.replace(/^./, sorter[0].toUpperCase());

    if (sorter != sorters.activeSorter) {
        sorterElement.innerHTML = capitalized + "&nbsp;&nbsp;-";
        sorterElement.style.backgroundColor = "#FDFDFD";
    } else if (!sorters.isReversed) {
        sorterElement.innerHTML = capitalized + " &#x25B2";
        sorterElement.style.backgroundColor = "#ffd470";
    } else {
        sorterElement.innerHTML = capitalized + " &#x25BC";
        sorterElement.style.backgroundColor = "#b0faff";
    }
} 

function sort() {
    function compare(a, b, decider) {
        // Returns 1  if a is before b
        // Returns 0  if a and b are equal
        // Returns -1 if a is after b
        let _a = a[decider];
        let _b = b[decider];

        if (decider == "author") {
            _a = a.author.split(" ", -1);
            _a = _a[_a.length - 1];
            _b = b.author.split(" ", -1);
            _b = _b[_b.length - 1];
        }

        if (_a == _b) return 0;
        return ((_a < _b) * 2 - 1);
    }

    function getSortingPriority() {
        switch (sorters.activeSorter) {
            case "title": return ["title", "author", "series", "seriesNO"];
            case "author": return ["author", "series", "seriesNO", "title"];
            case "series": return ["series", "seriesNO", "author", "title"];
        }
    }

    let sortingPriority = getSortingPriority();

    database.sort((a, b) => {
        let result = 0;
        for (let i = 0; i < sortingPriority.length; i++) {
            if (result == 0) {
                result = compare(a, b, sortingPriority[i]);
            } else {
                break;
            }
        }
        return result;
    });

    if (sorters.isReversed) {
        database.reverse();
    }

    for (let i = 0; i < database.length; i++) {
        resultsContainer.insertBefore(dataNodes[database[i].id], loadingMessage);
    }
}

function populateDataNodes() {
    // Creates an HTML node for every entry in the database variable
    for (let i = 0; i < database.length; i++) {
        database[i].id = i;
        dataNodes[i] = createDataNode(database[i]);
        dataNodes[i].id = i;
        resultsContainer.appendChild(dataNodes[i]);
    }
    updateResultsCounter(database.length);
}

function createDataNode(entry) {

    function formatSeriesName(seriesName) {
        let formattedName = "";
        let nameFields = seriesName.split(" ", -1);
        if (nameFields[0] != "The"
         && nameFields[0] != "Her"
         && nameFields[0] != "His") {
            formattedName += "The ";
        }
        formattedName += seriesName;
        if (nameFields[nameFields.length - 1] != "Series" 
         && nameFields[nameFields.length - 1] != "Trilogy"
         && nameFields[nameFields.length - 1] != "Franchise"
         && nameFields[nameFields.length - 1] != "Stories"
         && nameFields[nameFields.length - 1] != "Chronicles") {
            formattedName += " Series"
        }

        return formattedName + " - ";
    }

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

    let smallText = "";
    let bigText = entry.title;

    if (entry.series != "~" && entry.series != entry.title) {
        if (entry.bookType == "Manga") {
            bigText = entry.series;
            smallText = entry.title + " - ";
        } else {
            smallText = formatSeriesName(entry.series);
        }
    }

    let title = document.createElement("p");
    title.appendChild(document.createTextNode(bigText));
    title.classList.add("title");
    info.appendChild(title);

    let authors = document.createElement("p");
    smallText += "By " + entry.author;
    if (entry.illistrator != undefined) {
        smallText += " and " + entry.illistrator;
    }
    authors.appendChild(document.createTextNode(smallText));
    authors.classList.add("authors");
    info.appendChild(authors);

    if (entry.read) {
        let read = document.createElement("div");
        read.innerHTML = "&#x2714;";
        read.classList.add("read");
        wrapper.appendChild(read);
    }

    wrapper.appendChild(info);

    if (entry.obtained == undefined) {
        wrapper.classList.add("unowned");
    } else {
        let metadata = document.createElement("div");
        metadata.classList.add("metadata");

        let bookType = document.createElement("p");
        bookType.appendChild(document.createTextNode(entry.bookType + " - " + entry.pages + " pages"));
        metadata.appendChild(bookType);

        let obtained = document.createElement("p");
        let price = (entry.price == 0) ? "free" : formatMoney(entry.price);
        obtained.appendChild(document.createTextNode("Obtained from " + entry.obtained + " for " + price));
        metadata.appendChild(obtained);

        metadata.style.display = "none";
        wrapper.appendChild(metadata);

        wrapper.onclick = () => {
            if (metadata.style.display == "none") {
                metadata.style.display = "block";
                wrapper.classList.add("open");
            } else {
                metadata.style.display = "none";
                wrapper.classList.remove("open");
            }
        }

        wrapper.style.cursor = "pointer";
    }

    return wrapper;
}

function formatMoney(price) {
    let money = "" + price;
    let cents = money.split(".", -1);
    if (cents.length == 1) {
        // No cents
        return "$" + price + ".00";
    } else if (cents[1].length == 1) {
        return "$" + price + "0";
    } else {
        return "$" + price;
    }
}