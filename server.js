const express= require('express');
let request = require('request');

let app = express();

app.set('port', process.env.PORT || 3001);

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));


app.get('/',(req,res) =>{
    res.render('index.html');
})

app.get('/select',(req,res) =>{
    res.render('select.html');
})

app.get('/players', (req,res) => {

    var postBody = {
        campeonato: "Eliminatorias da Copa do Mundo",
        ano: 2017,
        equipes: {
            mandante: "Brasil",
            visitante: "Venezuela"
        },
        rodada: 1
    }

    request({
        url: 'http://jimmycricket-orquestrador.mybluemix.net/jimmycricket/api/v1/partida/findMatch',
        method: "POST",
        json: true,
        body: postBody
    }, function (error, response, body){
        if(!error){
            console.log(body);
            res.status(200).json(body);
        }else{
            console.log(error);
            res.sendStatus(400);
        }
    });
    // let options = {
    //     uri: 'https://jimmycricket-orquestrador.mybluemix.net/jimmycricket/api/v1/partida/findMatch',
    //     body: {
    //         campeonato: "Eliminatorias da Copa do Mundo",
    //         ano: 2017,
    //         equipes: {
    //           mandante: "Brasil",
    //           visitante: "Venezuela"
    //         },
    //         rodada: 1
    //     },
    //     method: 'POST',

    // }

    // request(options, (error, response, body) =>{
    //     if(!error && response.statusCode == 200){
    //         res.status(200).json(body);
    //     }else{
    //         res.sendStatus(400);
    //     }
    // })
})



app.listen(app.get('port'),'0.0.0.0',()=>{
    console.log(`App is listening on port: ${app.get('port')}`);
})