// include file system module
var fs = require('fs');


//hardcoded for now, but will need to load the response object
fs.readFile('mlk.json',
    // callback function that is called when reading file is done
    function(err, data) {
        var jsonData = data;

        // parse json
        var jsonParsed = JSON.parse(jsonData);

        // access elements
        text = ""
        for (i = 0; jsonParsed.monologues[i] !== undefined; i++) {
            for (j = 0; jsonParsed.monologues[i].elements[j] !== undefined; j++) {
                text += jsonParsed.monologues[i].elements[j].value;
            }
        }
        console.log(text)
    });
