var wsUri = "wss://jimmycricket-orquestrador.mybluemix.net/websocket";
try {
    var ws = new WebSocket(wsUri);
} catch (err) {
    console.log("caquita do websocket");
}
var timestamp_global = Date.now();
ws.onopen = function (ev) {};
ws.onclose = function (ev) {};
ws.onmessage = function (ev) {
    console.log(ev.data);
    var message = JSON.parse(ev.data);
    if (message.scouts != undefined) {
        // {scouts:[{"tipo":"certo","nome":"Neymar","posicao":"14"}],"timestamp":1513260085966}
        // var r = document.getElementById('idDoRow_sta');
        var row = document.getElementById('iddorow2');
        var str = "";
        for (var i = 0; i < message.scouts.length; i++) {
            str += createScoutCard(message.scouts[i], message.timestamp, message.scouts.length);
        }
        // timestamp_global = message.timestamp;
        row.innerHTML += str;
    }
};

function createScoutCard(scout, timestamp, length) {
    let img = '/img/player_icon.png';
    let nome = scout.nome;
    let lance = scout.tipo;
    let interval = (timestamp - timestamp_global) / length;
    let tempo = millisToMinutesAndSeconds(interval);
    return '<div>' +
        '<div class="card row flex">' +
        '<div class="col s3 center-align scouts-label"><img src="' + img + '" class="player-pic center-align nospace"/></div>' +
        '<div class="col s3 center-align scouts-label"><span class="player_name">' + nome + '</span></div>' +
        '<div class="col s4 center-align scouts-label">' + lance + '</div>' +
        '<div class="col s2 center-align scouts-label">' + tempo + '</div>' +
        '</div>' +
        '</div>';
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}