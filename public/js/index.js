function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) { }
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

xhrGet('/players', function(resultado) {
// aqui cai no caso de status code 200
    resultado = JSON.parse(resultado);
    var row = document.getElementById('idDoRow');
    var str = "";

    for(var i = 0 ; i < resultado[0].equipes[0].jogadores.length; i++){
        str += createPlayerCard(resultado[0].equipes[0].jogadores[i], resultado[0].equipes[0].nome);
    }
    row.innerHTML += str;

}, function (error) {
    //aqui cai no caso de erro
    alert('Ai caquita')
})


function createPlayerCard(player, team){
    let img = (player.image != undefined )?player.image:'/img/player_icon.png';
    let logo = (player.team_logo != undefined )?player.team_logo:'/img/brasillogo.png';
    let role = (player.role != undefined )?player.role:'JOGADOR';
    var overall = Math.round((player.scouts.certo*0.3+player.scouts.errado*(-0.3)+player.scouts.passe_decisivo*5)*100)/100;
    return '<div class="col s12 m10 offset-m1 l8 offset-l2">'+
            '<div class="card row flex">'+
                    '<div class="col s1 nospace center-align"><img  src="'+logo+'"class="logo"/>'+team+'</div>'+
                    '<div class="col s2 nospace center-align"><img  src="'+img+'" class="player-pic center-align nospace"/></div>'+
                    '<div class="col s1 nospace center-align"><span class="player_name">'+player.nome+'</span><br><span class="scouts-label">'+role+'</span></div>'+
                    '<div class="col s2 center-align scouts">'+overall+'</div>'+
                    '<div class="col s2 center-align scouts">'+player.scouts.certo+'</div>'+
                    '<div class="col s2 center-align scouts">'+player.scouts.errado+'</div>'+
                    '<div class="col s2 center-align scouts">'+player.scouts.passe_decisivo+'</div>'+                
           '</div>'+
        '</div>';
}