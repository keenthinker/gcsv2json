var https = require('https');

// (c) https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function convertCSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ) {

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);

    }


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return (arrData);
}


function getCSV(link) {

  return new Promise(function (resolve, reject) {

    try {      
      const options = new URL(link);
      var req = https.request(options, function (res) {

        var chunks = [];
        var json = { rows: [] };

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);

          var rows = convertCSVToArray(body.toString().split(','), ',');
          // get first row to see how many columns has the CSV table 
          var rowColumnTitles = rows[0];
          var rowColumnCount = rowColumnTitles.length;
          // remove column titles row
          var rowsData = rows.slice(1, rows.length);
          // traverse the "table"
          for (i = 0; i < rowsData.length; i++) {
            var row = rowsData[i];
            // traverse single row
            var rowJson = {};
            for (j = 0; j < rowColumnCount; j++) {
              rowJson[String(rowColumnTitles[j])] = row[j];
            }
            json.rows.push(rowJson);
          }
          json["rowsCount"] = rowsData.length;
          resolve(json);
        });

        res.on("error", function (error) {
          //console.error(error);
          reject(error);
        });
      });

      req.on('error', function (error) {
        //console.error(error);
        reject(error);
      });

      req.end();
    } catch (error) {
      //console.log(JSON.stringify(error, null, 2));
      reject(error);
    }
  });
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if(req.body === undefined || req.body.link === undefined) {
    res.status(400).json({ 'error': 'Request body or parameter is missing or is invalid. Request body should contain the following JSON structure: { link: https://docs.google.com/link_to_csv_sheet }'});
    return;
  }
  
  getCSV(req.body.link)
  .then(function (content) {
    res.status(200).json(content);
  })
  .catch(function (error) {
    res.status(400).json({ 'error': error });
  });
}