var wsUri = "wss://jimmycricket-orquestrador.mybluemix.net/websocket";
try {
    var ws = new WebSocket(wsUri);
} catch (err) {
    console.log("caquita do websocket");
}
var timestamp_init = Date.now();
var timestamp_last = Date.now();
var timerID = 0;
ws.onopen = function (ev) {
    keepAlive();
    xhrGet('/stat', function (result) {
        result = JSON.parse(result);
        var r = document.getElementById('idDoRow_stat');
        var str_1 = '';
        for (var i = 0; i < result.length; i++) {
            for (var key in result[0].stats) {
                createStatisticsCard(result[i], key, i);
            };
        };
        r.innerHTML += str_1;
    }, function (err) {
        alert('i deu erro');
    });
};
ws.onmessage = function (ev) {
    let msg = JSON.parse(ev.data);
    console.log(msg);
    if (msg.scouts != undefined) {
        // {scouts:[{"tipo":"certo","nome":"Neymar","posicao":"14"}],"timestamp":1513260085966}
        var row = document.getElementById('iddorow2');
        var str = "";
        for (var i = 0; i < msg.scouts.length; i++) {
            let interval = (msg.timestamp - timestamp_last) / msg.scouts.length;
            let timestamp = (msg.timestamp - timestamp_init) - interval * i;
            str += createScoutCard(msg.scouts[i], timestamp, msg.scouts.length);
        };
        timestamp_last = msg.timestamp;
        row.outerHTML += str;
    };
    if (msg.scouts != undefined) {
        xhrGet('/stat', function (result) {
            result = JSON.parse(result);
            var r = document.getElementById('idDoRow_stat');
            var str_1 = '';
            for (var i = 0; i < result.length; i++) {
                for (var key in result[0].stats) {
                    createStatisticsCard(result[i], key, i);
                };
            };
            r.innerHTML += str_1;
        }, function (err) {
            alert('i deu erro');
        });
    };
};
ws.onclose = function (ev) {
    cancelKeepAlive();
};

function keepAlive() {
    let timeout = 20000;
    if (ws.readyState == ws.OPEN) {
        ws.send('');
        console.log('Echo');
    };
    timerID = setTimeout(keepAlive, timeout);
};

function cancelKeepAlive() {
    if (timerID) {
        clearTimeout(timerID);
    }
};

function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {};
        };
    };
    return null;
};

function xhrGet(url, callback, errback) {
    var xhr = new createXHR();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log('test');
                callback(xhr.responseText);
            } else {
                errback((xhr.responseText));
            };
        };
    };
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send();
};

function createScoutCard(scout, timestamp, length) {
    let img = '/img/player_icon.png';
    let nome = scout.nome;
    let lance = lanceGenerico(scout.tipo);
    let tempo = millisToMinutesAndSeconds(timestamp);
    return '<div class="card row flex heightcard">' +
        '<div class="col s3 scouts-label center-align"><img src="' + img + '" class="player-pic center-align nospace"/></div>' +
        '<div class="col s3 scouts-label center-align"><span class="player_name"><p>' + nome + '</p></span></div>' +
        '<div class="col s3 scouts-label center-align"><p>' + lance + '</p></div>' +
        '<div class="col s3 scouts-label center-align"><p>' + tempo + '</p></div>' +
        '</div>';
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0':'')}${seconds}`;
};

function lanceGenerico(param) {
    switch (param) {
        case 'certo':
        case 'lance':
        case 'passe_decisivo':
            param = 'passe certo';
            break;
        case 'errado':
            param = 'passe errado';
            break;
        case 'chute':
        case 'chute_dentro_area_bloqueado':
        case 'chute_dentro_area_defendido':
        case 'chute_dentro_area_fora':
        case 'chute_fora_da_area_bloqueado':
        case 'chute_fora_da_area_defendido':
        case 'chute_fora_da_area_para_fora':
        case 'cobranca_falta_bloqueada':
        case 'cabeceio_grande_area_defendido':
            param = 'chute a gol';
            break;
        case 'gol_chute_dentro_area':
            param = 'GOL';
            break;
        case 'assistencia':
        case 'levantada':
        case 'passe_decisivo':
        case 'ultimo_passe':
            param = 'assistência';
            break;
        case 'desarme':
        case 'roubada':
            param = 'desarme';
            break;
        case 'defesa_normal':
            param = 'defesa do goleiro';
            break;
        case 'amarelo':
            param = 'cartão amarelo';
            break;
        case 'falta_cometida':
            param = 'falta cometida';
            break;
        default:
            param = '_____';
            break;
    };
    return param;
};

function createStatisticsCard(scout, key, n) {
    let s = scout.stats;
    let certo = s[key] + s['lance'] + s['passe_decisivo'];
    let chute = s['chute_dentro_area_bloqueado'] + s['chute_dentro_area_defendido'] +
        s['chute_dentro_area_fora'] + s['chute_fora_da_area_bloqueado'] +
        s['chute_fora_da_area_defendido'] + s['chute_fora_da_area_para_fora'] +
        s['cobranca_falta_bloqueada'];
    let assistencia = s['levantada'] + s['passe_decisivo'];
    let desarme = s['desarme'] + s['roubada'];
    switch (key) {
        case 'amarelo':
            document.getElementById(`${key}_${n+1}`).innerHTML = s[key];
            break;
        case 'certo':
            document.getElementById(`${key}_${n + 1}`).innerHTML = certo;
            break;
        case 'errado':
            document.getElementById(`${key}_${n+1}`).innerHTML = s[key];
            break;
        case 'chute_dentro_area_bloqueado':
            document.getElementById(`${key}_${n+1}`).innerHTML = chute;
            break;
        case 'gol_chute_dentro_area':
            document.getElementById(`${key}_${n + 1}`).innerHTML = s[key];
            break;
        case 'levantada':
            document.getElementById(`${key}_${n + 1}`).innerHTML = assistencia;
            break;
        case 'falta_cometida':
            document.getElementById(`${key}_${n + 1}`).innerHTML = s[key];
            break;
        case 'desarme':
            document.getElementById(`${key}_${n + 1}`).innerHTML = desarme;
            break;
        case 'defesa_normal':
            document.getElementById(`${key}_${n + 1}`).innerHTML = s[key];
            break;
        default:
            break;
    };
};