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
        var row = document.getElementById('idDoRow_sta');
        var header = document.getElementById('foto').outerHTML + document.getElementById('idDoHeader').outerHTML;
        var str = header;
        for (var i = 0; i < message.scouts.length; i++) {
            str += createScoutCard(message.scouts[i], message.timestamp);
        }
        timestamp_global = message.timestamp;
        row.innerHTML += str;
    }
};

function createScoutCard(scout, timestamp) {
    let img = (player.image != undefined) ? player.image : '/img/player_icon.png';
    let nome = scout.nome;
    let lance = scout.tipo;
    let interval = (timestamp_global - timestamp) / message.scouts.length;
    let tempo = timestamp_global + interval * (i + 1);
    return '<div class="col s12 m10 offset-m1 l8 offset-l2">' +
        '<div class="card row flex">' +
        '<div class="col s2 nospace center-align"><img src="' + img + '" class="player-pic center-align nospace"/></div>' +
        '<div class="col s1 nospace center-align"><span class="player_name">' + nome + '</span></div>' +
        '<div class="col s2 center-align scouts">' + lance + '</div>' +
        '<div class="col s2 center-align scouts">' + tempo + '</div>' +
        '</div>' +
        '</div>';
}