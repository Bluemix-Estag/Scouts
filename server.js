const express = require('express');
const request = require('request');
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.render('index.html');
});
app.get('/select', (req, res) => {
    res.render('select.html');
});
app.get('/history', (req, res) => {
    res.render('history.html');
});
app.get('/players', (req, res) => {
    let postBody = {
        campeonato: "Eliminatorias da Copa do Mundo",
        ano: 2017,
        equipes: {
            mandante: "Brasil",
            visitante: "Venezuela"
        },
        rodada: 1
    };
    request({
        url: 'https://jimmycricket-orquestrador.mybluemix.net/jimmycricket/api/v1/partida/findMatch',
        method: "POST",
        json: true,
        body: postBody
    }, function (error, response, body) {
        if (!error) {
            console.log(body);
            res.status(200).json(body);
        } else {
            console.log(error);
            res.sendStatus(400);
        };
    });
});
app.get('/stat', (req, res) => {
    let postBody = {
        campeonato: "Eliminatorias da Copa do Mundo",
        ano: 2017,
        equipes: {
            mandante: "Brasil",
            visitante: "Venezuela"
        },
        rodada: 1
    };
    request({
        url: 'https://jimmycricket-orquestrador.mybluemix.net/jimmycricket/api/v1/partida/statistics',
        method: "POST",
        json: true,
        body: postBody
    }, function (error, response, body) {
        if (!error) {
            console.log(body[0]);
            res.status(200).json(body);
        } else {
            console.log(error);
            res.sendStatus(400);
        };
    });
});
app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`App is listening on port: ${app.get('port')}`);
});