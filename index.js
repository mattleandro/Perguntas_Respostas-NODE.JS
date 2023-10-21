const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//database
connection
  .authenticate()
  .then(() => {
    console.log("conexão feita com o banco de dados!");
  })
  .catch((msgErro) => {
    console.log("msgErro");
  });
// Estou dizendo para o Express usar o EJS como View engine
app.set("view engine", "ejs");
app.use(express.static("public"));
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["ID", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas, // Passar o objeto perguntas para a renderização
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
  //res.send(
  //"Formulário recebido! titulo " + titulo + " " + " descricao " + descricao
  //)
});

app.get("/pergunta/:id", (req, res) => {
  const id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      res.render("pergunta", {
        pergunta: pergunta, // Passe o objeto 'pergunta' para a visualização
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.perguntaId;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(8080, () => {
  console.log("App rodando!");
});
