const http         = require('http');
const fs           = require('fs');
const path         = require('path');

const port = process.argv[2] || 8080;

const server = http.createServer((req, res) => {

  req.url = req.url == '/' ? 'index.html' : req.url;

    try {

      let pathname = path.join(__dirname, fileName);
      fs.accessSync(pathname);

      req.url = fileName;

    } catch(err) {
      console.log(err);
    }


  fs.createReadStream(path.join(__dirname, req.url), {flags: 'r'})
  .on('error', (err) => {
    let content = fs.readFileSync(path.join(__dirname, '404.html'));
    res.statusCode = 404;

    res.end(content);
  })
  .pipe(res);

});

server.listen(port, (err) => {
  if (err) throw err;

  console.log("Server running on port " + port);
});
