var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var BinaryServer = require("binaryjs").BinaryServer;
var https = require("https");
var wav = require("wav");
var exec = require("child_process").exec;

const fs = require("fs");
const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient();

const Lame = require("node-lame").Lame;
var request = require("request");
var requests = require("requests");

var port = 3000;
var outFile = "demo.wav";
var app = express();

app.use(bodyParser.json());

app.use("/js", express.static("js"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/audioRoute", function(req, res) {});

app.post("/dialogflow", function(req, res) {
  let dfText = req.body.queryResult.queryText;
  let dfParams = req.body.queryResult.parameters;

  console.log("The user said: " + dfText);
  // console.log(dfParams);

  switch (dfParams.action) {
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
  console.log(
    "I want to change the background color of a " +
      params.tag +
      " tag to " +
      params.newColor +
      "."
  );
  return;
}

function changeTagTextColor(params) {
  console.log(
    "I want to change the text color of a " +
      params.tag +
      " tag to " +
      params.newColor +
      "."
  );
  return;
}

function changeTagSize(params) {
  console.log(
    "I want to change the size of a " +
      params.tag +
      " to be " +
      params.sizeChange +
      "."
  );
  return;
}

binaryServer = BinaryServer({ port: 9001 });

binaryServer.on("connection", function(client) {
  console.log("new connection");

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on("stream", function(stream, meta) {
    var x = "";
    console.log("new stream");
    stream.pipe(fileWriter);

    stream.on("end", function() {
      fileWriter.end();
      console.log("wrote to file " + outFile);
      setTimeout(function() {
        console.log("begin GCP process");
        const fileName = "./demo.wav";

        // Reads a local audio file and converts it to base64
        const file = fs.readFileSync(fileName);
        const audioBytes = file.toString("base64");
        const audio = {
          content: audioBytes
        };
        console.log(audioBytes);
        const config = {
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: "en-US"
        };
        console.log("config");
        const request = {
          audio: audio,
          config: config
        };
        client
          .recognize(request)
          .then(data => {
            const response = data[0];
            const transcription = response.results
              .map(result => result.alternatives[0].transcript)
              .join("\n");
            console.log(`Transcription: ${transcription}`);
          })
          .catch(err => {
            console.error("ERROR:", err);
          });
      }, 5000);
    }); /*
      request.post(
        {
          headers: {
            Authorization:
              "Bearer 01Ci_bKCjum7QV5VhzQjf2W-U1gJJBbVxiZPXy7X88yaU66AoTHiEeVGuRFrt7-C3jUAwdDXwY02qk2_RxL6GcqGq4LYg",
            "Content-Type": "multipart/form-data"
          },
          url: "https://api.rev.ai/revspeech/v1beta/jobs",
          body: "media=@./demo.wav;type=audio/wav"
        },
        function(error, response, body) {
          console.log(error);
          console.log(response);
          console.log(body);
        }
      );
      */
    /*
    setTimeout(function() {
      myheaders = {
        Authorization:
          "Bearer 01Ci_bKCjum7QV5VhzQjf2W-U1gJJBbVxiZPXy7X88yaU66AoTHiEeVGuRFrt7-C3jUAwdDXwY02qk2_RxL6GcqGq4LYg"
      };
      r = request
        .get(
          "https://api.rev.ai/revspeech/v1beta/jobs/" + x,
          (headers = myheaders)
        )
        .on("response", function(response) {
          console.log(response.statusCode); // 200
          console.log(response.headers["content-type"]); // 'image/png'
        });
      console.log(r);
    }, 10000);

*/
  });
});
