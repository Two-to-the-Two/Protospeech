//var fs = require("fs");
//var request = require("request");

//webkitURL is deprecated but nevertheless

URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var recorder; //WebAudioRecorder object
var input; //MediaStreamAudioSourceNode  we'll be recording
var encodingType; //holds selected encoding for resulting audio (file)
var encodeAfterRecord = true; // when to encode

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function startRecording() {
  console.log("startRecording() called");

  /*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

  var constraints = { audio: true, video: false };

  /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
      __log(
        "getUserMedia() success, stream created, initializing WebAudioRecorder..."
      );

      /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
      audioContext = new AudioContext();

      //update the format
      document.getElementById("formats").innerHTML =
        "Format: 2 channel " +
        encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value +
        " @ " +
        audioContext.sampleRate / 1000 +
        "kHz";

      //assign to gumStream for later use
      gumStream = stream;

      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);

      //stop the input from playing back through the speakers
      //input.connect(audioContext.destination)

      //get the encoding
      encodingType =
        encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;

      //disable the encoding selector
      encodingTypeSelect.disabled = true;

      recorder = new WebAudioRecorder(input, {
        workerDir: "js/", // must end with slash
        encoding: encodingType,
        numChannels: 2, //2 is the default, mp3 encoding supports only 2
        onEncoderLoading: function(recorder, encoding) {
          // show "loading encoder..." display
          __log("Loading " + encoding + " encoder...");
        },
        onEncoderLoaded: function(recorder, encoding) {
          // hide "loading encoder..." display
          __log(encoding + " encoder loaded");
        }
      });

      recorder.onComplete = function(recorder, blob) {
        __log("Encoding complete");
        createDownloadLink(blob, recorder.encoding);
        encodingTypeSelect.disabled = false;
      };

      recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: encodeAfterRecord,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 }
      });

      //start the recording process
      recorder.startRecording();

      __log("Recording started");
    })
    .catch(function(err) {
      //enable the record button if getUSerMedia() fails
      recordButton.disabled = false;
      stopButton.disabled = true;
    });

  //disable the record button
  recordButton.disabled = true;
  stopButton.disabled = false;
}

function stopRecording() {
  console.log("stopRecording() called");

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //disable the stop button
  stopButton.disabled = true;
  recordButton.disabled = false;

  //tell the recorder to finish the recording (stop recording + encode the recorded audio)
  recorder.finishRecording();

  __log("Recording stopped");
}

function createDownloadLink(blob, encoding) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var li = document.createElement("li");
  var link = document.createElement("a");
  //console.log(url);
  /* curl -X POST "https://api.rev.ai/revspeech/v1beta/jobs"
-H "Authorization: Bearer <api_key>" -H "Content-Type: application/json"
-d "{\"media_url\":\"https://support.rev.com/hc/en-us/article_attachments/200043975/FTC_Sample_1_-_Single.mp3\",\"metadata\":\"This is a sample submit jobs option\"}"


  var formData = new FormData();
  formData.append(
    "options",
    JSON.stringify({
      metadata: "This is a sample submit jobs option"
    })
  );
  formData.append(
    "media",
    //"https://support.rev.com/hc/en-us/article_attachments/200043975/FTC_Sample_1_-_Single.mp3"
    "@/Users/MichaelHendrick/Downloads/dot.mp3;type=audio/mp3"
  );

var payLoad = {
    media_url:
      "https://support.rev.com/hc/en-us/article_attachments/200043975/FTC_Sample_1_-_Single.mp3",
    options: { metadata: "This is a sample submit jobs option" }
  };

  $.ajax({
    type: "POST",
    method: "POST",
    cache: false,
    url: "https://api.rev.ai/revspeech/v1beta/jobs",
    beforeSend: function(xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer 01Ci_bKCjum7QV5VhzQjf2W-U1gJJBbVxiZPXy7X88yaU66AoTHiEeVGuRFrt7-C3jUAwdDXwY02qk2_RxL6GcqGq4LYg"
      );
    },
    data: formData,
    contentType: false,
    processData: false,
    success: function(data, status, xhr) {
      console.log("Success", data, status, xhr);
    },
    error: function(xhr, status, e) {
      console.log("Error", xhr, status, e);
    }
  });
	*/

  console.log("We've made it here");

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //link the a element to the blob
  link.href = url;
  link.download = new Date().toISOString() + "." + encoding;
  link.innerHTML = link.download;

  //add the new audio and a elements to the li element
  li.appendChild(au);
  li.appendChild(link);

  //add the li element to the ordered list
  recordingsList.appendChild(li);
}

//helper function
function __log(e, data) {
  log.innerHTML += "\n" + e + " " + (data || "");
}
