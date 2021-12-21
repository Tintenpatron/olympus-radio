const player = require('./playerManager');
const fs = require('fs');

exports.currentStation = function(){
    let json = JSON.parse(fs.readFileSync('./stations.json', "utf8", function(err, data) {}));
    return(json['currentStation'])
}

exports.stationCount = async function(){
    let i = 0;
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    for(let [key, value] of Object.entries(json)){
        if(!isNaN(key)){
            i++;
        }
    }
    return i;
}

exports.isStation = function(string){
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    for(let [key, value] of Object.entries(json)){
        if(value === string){
            return true;
        }
    }
    return false;
}

exports.getStationList = function (){
    let stations = [];
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    for(let [key, value] of Object.entries(json)){
        if(!isNaN(key)){
            stations.push(key + ' | ' + value + ' | ' + json[key + 'Url']);
        }
    }
    return stations;
}

exports.getStation = function(string){
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    for(let [key, value] of Object.entries(json)) {
        if ((key.toLowerCase() === string.toLowerCase() || value.toLowerCase() === string.toLowerCase()) && key !== "currentStation") {
            return {
                id: parseInt(key),
                name: value,
                url: json[key + 'Url']
            }
        }
    }
}

exports.addStation = async function(name, url){
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    let count = (parseInt(await this.stationCount()))+1;

    json[count] = name;
    json[count + 'Url'] = url;

    for(let [key, value] of Object.entries(json)){
        if(value.toLowerCase() === name.toLowerCase() && key !== "currentStation"){
            return new Error('This station already exists');
        }
    }
    fs.writeFile('./stations.json', JSON.stringify(json), null, 4, function(err){
        return !err;
    })
}

exports.switchStation = async function(id){
    let json = JSON.parse(fs.readFileSync('./stations.json'));
    let station = this.getStation(id.toString());
    if(!station) return false;

    json['currentStation'] = station.name;
    json['currentUrl'] = station.url;

    fs.writeFile('./stations.json', JSON.stringify(json, null, 4), function(err){
        return !err;
    })
    await player.play(station.url, station.name);

    return true;
}
