var express = require('express'),
    app = express();

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
let fs = require('fs');
arqJogadores = fs.readFileSync(__dirname + '/data/jogadores.json');
jogadores = JSON.parse(arqJogadores);
arqJogosPorJogadores = fs.readFileSync(__dirname + '/data/jogosPorJogador.json');
jogosPorJogador = JSON.parse(arqJogosPorJogadores);
var db = {
    jogadores,
    jogosPorJogador
};

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')

app.get('/', function (req, res) {
    res.render('index', db.jogadores )
})

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:numero_identificador', function (req, res) {
    jogadorId = req.params.numero_identificador
    let player
    for (let i = 0; i < db.jogadores.players.length; i++) {
        if(db.jogadores.players[i].steamid == jogadorId){
            player = db.jogadores.players[i]
        }
    }
    jogosJogador = db.jogosPorJogador[jogadorId]
    jogos = jogosJogador.games
    jogos.sort(function compare(a,b) {
        return b.playtime_forever-a.playtime_forever
    })
    let naoJogados = 0
    for (let i = 0; i < jogos.length; i++) {
        if(jogos[i].playtime_forever == 0){
            naoJogados++
        }else{
            jogos[i].playtime_forever = Math.round(jogos[i].playtime_forever / 60)
        }
    }
    let top5 = jogos.slice(0, 5)
    res.render('jogador', { 'player': player, 'maisJogado':jogos[0], 'qtdeJogos':jogos.length,
                            'naoJogados': naoJogados, 'top5':top5 } )
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static(__dirname + '/../client'))
// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000)