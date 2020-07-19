"use strict";

// This file is not meant to be included in production code
// This is used to convert an excel spreadsheet into JSON

var input;
var output;
var index;

function setup() {
    input = document.getElementById("input");
    output = document.getElementById("output");
    document.getElementById("convert").onclick = () => convert();
}

function convert() {
    let JSON = "var database = [\n";
    let spreadsheetLines = input.value.split("\n", -1);
    for (index = 0; index < spreadsheetLines.length; index++) {
        JSON += convertLine(spreadsheetLines[index]);
    }
    JSON += "];";
    output.value = JSON;
}

function convertLine(line) {
    // Takes a string spreadsheet line in as input and returns the string JSON
    let fields = line.split("\t", -1);
    if (fields.length != 10) return error("Not properly formatted - there should be 10 fields seperated by tabs");

    if (fields[0] == "") return error("Title field cannot be empty");
    let JSON = "{title:'";
    JSON += escape(fields[0]);

    if (fields[1] == "") return error("Author field cannot be empty");
    JSON += "',author:'";
    JSON += escape(fields[1]);

    JSON += "',illistrator:";
    if (fields[2] == "") JSON += "undefined";
    else JSON += "'" + escape(fields[2]) + "'";

    JSON += ",bookType:";
    if (fields[3] == "-") JSON += "undefined";
    else JSON += "'" + fields[3] + "'";

    JSON += ",pages:";
    if (fields[4] == "") JSON += "undefined";
    else JSON += fields[4];

    JSON += ",read:";
    if (fields[5] == "C") JSON += "true";
    else JSON += "false";

    JSON += ",price:";
    if (fields[6] == "") JSON += "undefined";
    else JSON += fields[6].substring(1);

    JSON += ",obtained:";
    if (fields[7] == "" || fields[7] == "-") JSON += "undefined";
    else JSON += "'" + escape(fields[7]) + "'";

    if (fields[8] == "") return error("Series field cannot be empty");
    JSON += ",series:";
    if (fields[8] == "STANDALONE") JSON += "undefined";
    else JSON += "'" + escape(fields[8]) + "'";

    if (fields[9] == "") return error("SeriesNO field cannot be empty");
    JSON += ",seriesNO:";
    if (fields[9] == "0") JSON += "undefined";
    else if (fields[9].charAt(0) == "_") JSON += fields[9].substring(1);
    else JSON += fields[9];

    JSON += "},\n";
    return JSON;
}

function escape(string) {
    // places escape sequences before all of the quotes
    return string.replace("'", "\\'").replace('"', '\\"');
}

function error(string) {
    console.log("Error in line " + index + ": " + string);
    return "";
}