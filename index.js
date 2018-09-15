var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use("/js", express.static("js"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("home");
});

app.post('/dialogflow', function(req, res) {
	let dfText = req.body.queryResult.queryText;
	let dfParams = req.body.queryResult.parameters;

	console.log(dfText);
	console.log(dfParams);
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
