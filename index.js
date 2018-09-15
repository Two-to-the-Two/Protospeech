var express = require("express");
var exphbs = require("express-handlebars");
var app = express();

app.use("/js", express.static("js"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("home");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
