var wsUri = "wss://jimmycricket-orquestrador.mybluemix.net/websocket";
try {
    var ws = new WebSocket(wsUri);
} catch (err) {
    console.log("caquita do websocket");
}
var tempo= Date.now();

ws.onopen = function (ev) {
    xhrGet('/players', function (resultado) {
        // aqui cai no caso de status code 200
        resultado = JSON.parse(resultado);
        var row = document.getElementById('idDoRow');
        //var header = document.getElementById('idDoHeader').outerHTML;
        var str = "";
        //var str = JSON.stringify(header);
        //console.log(document.getElementById('idDoHeader'));
        for (var i = 0; i < resultado[0].equipes[0].jogadores.length; i++) {
            str += createPlayerCard(resultado[0].equipes[0].jogadores[i], resultado[0].equipes[0].nome);
        }
        row.innerHTML += str;
    }, function (error) {
        //aqui cai no caso de erro
        alert('Ai caquita')
    })
};

ws.onclose = function (ev) {};

ws.onmessage = function (ev) {
    console.log(ev.data);
    if (ev.data == "Updated") {
        xhrGet('/', function (resultado) {
            // [ { nome: 'Neymar', tipo: 'certo', tempo: 'timestamp'} ];
            // aqui cai no caso de status code 200
            resultado = JSON.parse(resultado);
            let temp_aux = resultado.tempo;
            resultado.tempo = resultado.tempo - tempo;
            tempo = resultado.temp_aux;
            var row = document.getElementById('idDoRow');
            var header = document.getElementById('foto').outerHTML + document.getElementById('idDoHeader').outerHTML;
            var str = header;
            //console.log(str);
            for (var i = 0; i < resultado.length; i++) {
                str += createHistoryCard(resultado);
            }
            row.innerHTML = str;

        }, function (error) {
            //aqui cai no caso de erro
            alert('Ai caquita')
        })
    }
};

function createHistoryCard(scout) {
    let nome = scout.name;
    let lance = scout.tipo;
    let tempo = scout.tempo;
    let img = (player.image != undefined) ? player.image : '/img/player_icon.png';
    let logo = (player.team_logo != undefined) ? player.team_logo : '/img/brasillogo.png';
    let role = (player.role != undefined) ? player.role : 'JOGADOR';
    return '<div class="col s12 m10 offset-m1 l8 offset-l2">' +
        '<div class="card row flex">' +
        '<div class="col s2 nospace center-align"><img  src="' + img + '" class="player-pic center-align nospace"/></div>' +
        '<div class="col s1 nospace center-align"><span class="player_name">' + nome + '</span><br><span class="scouts-label">' + role + '</span></div>' +
        '<div class="col s2 center-align scouts">' + lance + '</div>' +
        '<div class="col s2 center-align scouts">' + tempo + '</div>' +
        '</div>' +
        '</div>';
}

function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
    }
    return null;
}

function xhrGet(url, callback, errback) {
    var xhr = new createXHR();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log('test');
                callback(xhr.responseText);
            } else {
                errback((xhr.responseText));
            }
        }
    };
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send();
}