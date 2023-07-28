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
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model("Article", articlesSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({})
      .then((data) => {
        res.send({ data });
      })
      .catch((error) => {
        res.send(error);
      });
  })

  .post(function (req, res) {
    const articles = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    articles.save();
    res.redirect("/articles");
  })

  .delete(function (req, res) {
    Article.deleteMany({}).then((data) => {
      res.redirect("/articles");
    });
  });

app.route("/article/:articleId")
  .get(function (req, res) {
    console.log(req.params.articleId);
    Article.findById(req.params.articleId).then((data) =>{
      res.send({ data });
    })
  })
  .put(function (req, res) {
    Article.findByIdAndUpdate(req.params.articleId).then((data) => {
      data.title = req.body.title;
      data.content = req.body.content;
      data.save();
      res.send({ data });
    });
  })
  .patch(function (req, res) {
    Article.findByIdAndUpdate(req.params.articleId ).then((data) => {
      data.title = req.body.title;
      data.content = req.body.content;
      data.save();
      res.send({ data });
    }).catch((data) => {
      res.send({ data });
    })
  })
  .delete(function (req, res) {
    Article.deleteOne({ _id: req.params.articleId }).then((data) => {
      res.redirect("/articles");
    });
  });
  


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
