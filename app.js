//jshint esversion:6

const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/cheatsheetDB", {
  useNewUrlParser: true,
});

const articlesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Must have a title"],
  },
  content: {
    type: String,
    required: [true, "Must have some content"],
  },
});

const Article = mongoose.model("Article", articlesSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get("/articles", (req, res) => {
  Article.find({})
    .then((data) => {
      res.send({ data });
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/articles", (req, res) => {
  
  const articles = new Article ({
    title: req.body.title,
    content: req.body.content
  })
  articles.save();
  res.redirect('/articles')
});

app.get('/delete', (req, res) => {
  Article.deleteMany({}).then((data) =>{
    res.redirect('/articles')
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
