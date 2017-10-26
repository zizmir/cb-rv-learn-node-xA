const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const mlog  = require('./modules/mlog');
const _     = require('lodash');
const uuidv4  = require('uuid/v4');



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
      res.statusCode = 404;

      res.end(content);
    })
    .pipe(res);

    mlog.info("GET", req.url);
  }

  else if (req.method == "POST" && req.url == "/add-session") {
    let body = '';
    req.on('data', (data)=>{

      // create cookie with sessionID
      let sessionID= uuidv4();
      res.setHeader("Set-Cookie", "sessionID="+sessionID);


      body += data;
      console.log(body);
      res.write(body);
     
      let filename = `.sessions/${sessionID}.txt`;

      fs.writeFile(filename, body, function(err) {
      if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
      });
      res.end();
    });

  }

});

server.listen(port, (err) => {
  if (err) throw err;
  mlog.info("Server running on port ", port);
});
