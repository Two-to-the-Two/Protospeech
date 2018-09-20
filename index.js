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

	console.log("The user said: " + dfText);
	// console.log(dfParams);

	switch(dfParams.action) {
		case "new":
			makeNewTag(dfParams.tag);
			break;
		case "changeTagBackgroundColor":
			changeTagBackgroundColor(dfParams);
			break;
		case "changeTagTextColor":
			changeTagTextColor(dfParams);
			break;
		case "changeTagSize":
			changeTagSize(dfParams);
			break;
		default:
			console.log("PANIC");
	}
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});


function makeNewTag(tagType) {
	console.log("I want to make a new " + tagType + " tag.");
	return;
}

function changeTagBackgroundColor(params) {
	console.log("I want to change the background color of a " + params.tag + " tag to " + params.newColor + ".");
	return;
}

function changeTagTextColor(params) {
	console.log("I want to change the text color of a " + params.tag + " tag to " + params.newColor + ".");
	return;
}

function changeTagSize(params) {
	console.log("I want to change the size of a " + params.tag + " to be " + params.sizeChange + ".");
	return;
}
