const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const mlog  = require('./modules/mlog');
const _     = require('lodash');


const port = process.argv[2] || 8080;

const server = http.createServer((req, res) => {

  req.url = req.url == '/' ? 'index.html' : req.url;

    try {

      let pathName = path.join(__dirname, req.url);

      fs.accessSync(pathName);


    } catch(err) {
      //console.log(err);
    }
  if(req.method == "GET")
  {

  fs.createReadStream(path.join(__dirname, req.url), {flags: 'r'})
  .on('error', (err) => {
    let content = fs.readFileSync(path.join(__dirname, '404.html'));
    mlog.error(req.url);
    //res.statusCode = 404;

    res.end(content);
  })
  .pipe(res);


    mlog.info("GET", req.url);
  }

  else if (req.method == "POST" && req.url == "/add-session") {
        var body = '';
        req.on('data', (data)=>{
           body += data;
          console.log(body);
          res.write(body);
          res.end();
        });


  }





});

server.listen(port, (err) => {
  if (err) throw err;

  mlog.info("Server running on port ", port);
});
