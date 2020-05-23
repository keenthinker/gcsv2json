# gcsv2json

Generic CSV to JSON converter - https://gcsv2json.now.sh/

This REST API converts [CSV](https://tools.ietf.org/html/rfc4180) web input (e.g. single Google Spreadsheets published to the web, or pastebin, or gist, or you name it) to [JSON](https://www.json.org/json-en.html) format.

The API can be used in two ways:

* using a query parameter (parameter should be encoded with [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent))
* using a request with data in body
* WIP: custom delimiter (current fix delimiter is the - **,** - comma sign)

[Documentation](https://github.com/keenthinker/gcsv2json/wiki)

[Live demo](https://gcsv2json.now.sh/livedemo.html)