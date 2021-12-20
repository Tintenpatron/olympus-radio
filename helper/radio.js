const Player = require('./Player.js')
const fs = require('fs');

/**
 * Checkt ob eine String ein Integer ist
 * @param str
 * @returns {boolean}
 */
function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
        !isNaN(parseFloat(str))
}

/**
 * Returnt die aktuelle Radiostation
 * @returns {*}
 */
exports.currentStation = function(){
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName, "utf8", function(err, data) {});
    jsonData = JSON.parse(jsonData)
    return(jsonData['currentStation'])
}

/**
 * Returnt die Anzahl ans Stations
 * @returns {number}
 */
exports.getStationCount = function (){
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName, "utf8", function(err, data) {});
    jsonData = JSON.parse(jsonData)
    let i = 0;
    for(let [key, value] of Object.entries(jsonData)){
        if(isNumeric(key)){
            i++;
        }
    }
    return i;
}

/**
 * Returnt ob ein string eine Station ist
 * @param str
 * @returns {Promise<boolean>}
 */
exports.isStation = async function(str){
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName)
    jsonData = JSON.parse(jsonData)

    let check;
    for(let [key, value] of Object.entries(jsonData)){

        if(key.toLowerCase() === str.toLowerCase() || value.toLowerCase() === str.toLowerCase() && key !== "currentStation"){
            check = true;
        }
    }
    return check;
}

/**
 * Returnt einen Array mit allen Stations
 * @returns {Promise<*[]>}
 */
exports.getStationList = async function(){
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName)
    jsonData = JSON.parse(jsonData)
    let list = [];
    for(let [key, value] of Object.entries(jsonData)){
        if(isNumeric(key)){
            list.push(key + ' | ' + value)
        }
    }
    return list;
}

/**
 * Returnt ein Object mit ID, Name und URL einer Station
 * @param str
 * @returns {Promise<{name: unknown, id: number, url}|{}>}
 */
exports.getData = async function(str){
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName)
    jsonData = JSON.parse(jsonData)

    for(let [key, value] of Object.entries(jsonData)){

        if(key.toLowerCase() === str.toLowerCase() || value.toLowerCase() === str.toLowerCase() && key !== "currentStation"){
            let stationId = key;
            let url = jsonData[stationId+'Url']
            return {
                name: value,
                id: parseInt(key),
                url: url
            }
        }
    }
    return {};
}

/**
 * Added eine neue Station
 * @param client
 * @param data
 * @returns {Promise<Error>}
 */
exports.addStation = async function (client, data){
    let stationFile = require('../storage/stations.json');
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName)
    jsonData = JSON.parse(jsonData)

    stationFile[data.count] = data.name;
    stationFile[data.count+'Url'] = data.url;

    console.log(jsonData)

    for(let [key, value] of Object.entries(jsonData)){
        if(value.toLowerCase() === data.name.toLowerCase() && key !== "currentStation"){
            return new Error('Something went wrong: the radio station already exists')
        }
    }
    await fs.writeFile(
        fileName,
        JSON.stringify(stationFile, null, 2),
        function writeJSON(err){
            return !err;

        }
    )
}

/**
 * Changed die aktuelle Station zu einer neuen
 * @param client
 * @param data
 * @returns {Promise<void>}
 */
exports.switchStation = async function (client, data) {

    let stationFile = require('../storage/stations.json');
    let fileName = './storage/stations.json'
    let jsonData = fs.readFileSync(fileName)
    jsonData = JSON.parse(jsonData)
    stationFile.currentUrl = data.url;
    stationFile.currentStation = data.name;
    let config = require('../storage/config.json');

    Player.init(client, config, true)

    await fs.writeFile(
        fileName,
        JSON.stringify(stationFile, null, 2),
        function writeJSON(err){
            return !err;

        }
    )
}
