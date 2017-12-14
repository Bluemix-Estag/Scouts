var wsUri = "wss://jimmycricket-orquestrador.mybluemix.net/websocket";
try {
    var ws = new WebSocket(wsUri);
} catch (err) {
    console.log("caquita do websocket");
}


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
        // row.innerHTML += str;//comentei porque nao esta sendo usado no history

    }, function (error) {
        //aqui cai no caso de erro
        alert('Ai caquita')
    })

    xhrGet('/stat', function(result){
        result = JSON.parse(result);
        var r = document.getElementById('idDoRow_stat');
        var str_1 = '';
        for(var i = 0; i < result.length; i++){
            for (var key in result[0].stats) {
            // if(key == 'amarelo'){
                // alert(result[0].stats[key], key);
                // createStatisticsCard(result[0].stats[key], key);
                // createStatisticsCard(3, 1);
            // }
                createStatisticsCard(result[i], key, i);
            // str_1 += createStatisticsCard(result[0].stats[key], result[0].equipes[0].nome);
            }
        }
        r.innerHTML += str_1;
    }, function(err){
        alert('i deu erro');
    })
};

ws.onclose = function (ev) {


};

ws.onmessage = function (ev) {
    console.log(ev.data);
    if (ev.data == "Updated") {
        xhrGet('/players', function (resultado) {
            // aqui cai no caso de status code 200
            resultado = JSON.parse(resultado);
            var row = document.getElementById('idDoRow');
            var header = document.getElementById('foto').outerHTML + document.getElementById('idDoHeader').outerHTML;
            var str = header;
            //console.log(str);

            for (var i = 0; i < resultado[0].equipes[0].jogadores.length; i++) {
                str += createPlayerCard(resultado[0].equipes[0].jogadores[i], resultado[0].equipes[0].nome);
            }
            row.innerHTML = str;

        }, function (error) {
            //aqui cai no caso de erro
            alert('Ai caquita')
        })
    }

};

function createPlayerCard(player, team) {
    let img = (player.image != undefined) ? player.image : '/img/player_icon.png';
    let logo = (player.team_logo != undefined) ? player.team_logo : '/img/brasillogo.png';
    let role = (player.role != undefined) ? player.role : 'JOGADOR';
    var overall = Math.round((player.scouts.certo * 0.3 + player.scouts.errado * (-0.3) + player.scouts.passe_decisivo * 5) * 100) / 100;
    return '<div class="col s12 m10 offset-m1 l8 offset-l2">' +
        '<div class="card row flex">' +
        '<div class="col s1 nospace center-align"><img  src="' + logo + '"class="logo"/>' + team + '</div>' +
        '<div class="col s2 nospace center-align"><img  src="' + img + '" class="player-pic center-align nospace"/></div>' +
        '<div class="col s1 nospace center-align"><span class="player_name">' + player.nome + '</span><br><span class="scouts-label">' + role + '</span></div>' +
        '<div class="col s2 center-align scouts">' + overall + '</div>' +
        '<div class="col s2 center-align scouts">' + player.scouts.certo + '</div>' +
        '<div class="col s2 center-align scouts">' + player.scouts.errado + '</div>' +
        '<div class="col s2 center-align scouts">' + player.scouts.passe_decisivo + '</div>' +
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

function createHistoryCard(player, team) {
    let img = (player.image != undefined) ? player.image : '/img/player_icon.png';
    let logo = (player.team_logo != undefined) ? player.team_logo : '/img/brasillogo.png';
    let role = (player.role != undefined) ? player.role : 'JOGADOR';
    return '<div class="col s6 offset-7">' +
        '<div class="card row flex">' +
            '<div class="col s3 scouts-label center-align"><img  src="' + logo + '"class="logo"/>' + team + '</div>' +
            '<div class="col s3 scouts-label center-align"><img  src="' + img + '" class="player-pic center-align nospace"/></div>' +
            '<div class="col s3 scouts-label center-align">' + player.nome + '</span><br><span class="scouts-label">' + role + '</span></div>' +
            '<div class="col s3 scouts-label center-align">' + player.scouts.lance  + '</div>' +
            '<div class="col s3 scouts-label center-align">' + /*QUESTAO DO TEMPO*/ + '</div>' +
        '</div>' +
    '</div>';
}

function createStatisticsCard(scout, key, n) {
    let s = scout.stats;
    let certo = s[key] + s['lance'] + s['passe_decisivo'];;
    let chute = s['chute_dentro_area_bloqueado'] + s['chute_dentro_area_defendido'] + s['chute_dentro_area_fora'] + s['chute_fora_da_area_bloqueado'] + s['chute_fora_da_area_defendido'] + s['chute_fora_da_area_para_fora'] + s['cobranca_falta_bloqueada'];
    let assistencia = s['levantada'] + s['passe_decisivo'];
    let desarme = s['desarme']+s['roubada'];
    switch (key){
        case 'amarelo':
            document.getElementById(`${key}_${n+1}`).innerHTML = s[key];
            break;
        case 'vermelho':
            document.getElementById(`${key}_${n+1}`).innerHTML = scout.stats[key];
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
    }
    // return
    // '<div class="col s6">' +
    //     '<div class="card row flex">' +
    //     '<div class="col s3 scouts-label center-align">' + scout +
    //     '<div class="col s3 scouts-label center-align">' + player.scouts.lance + '</div>' +
    //     '<div class="col s3 scouts-label center-align">' + /*QUESTAO DO TEMPO*/ + '</div>' +
    //     '</div>' +
    //     '</div>';
}