# gcsv2json
Google CSV to JSON converter - (https://gcsv2json.now.sh/)[https://gcsv2json.now.sh/].

This API converts single Google Sheets published to the web in CSV format to JSON format.

The API can be used in two ways:

* using a query parameter (parameter should be encoded with encodeURIComponent):

    https://gcsv2json.now.sh/api/?csv=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2Fe%2F2PACX-1vSMtzdDStex7LdeOQVEDXwYYK6X-y2RESCfo0OaNy6KdchNeSuzDF3eUDIDbk-u_L-YWaVtxQ1bUACa%2Fpub%3Fgid%3D1200614530%26single%3Dtrue%26output%3Dcsv
            
* using a request with data in body:

    fetch("http://localhost:3000/api", {
        method: 'POST',
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => response.json())
    .then(data => console.log(data));
