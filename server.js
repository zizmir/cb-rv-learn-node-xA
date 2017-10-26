const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const mlog  = require('./modules/mlog');
const _     = require('lodash');
const uuidv4  = require('uuid/v4');



const port = process.argv[2] || 8080;

const server = http.createServer((req, res) => {

  // setTimeout(function (res) {
  //   res.setHeader("Set-Cookie", "");
  //   console.log('boo')
  // }, 100);
  req.url = req.url == '/' ? 'index.html' : req.url;

  try {

    let pathName = path.join(__dirname, req.url);

    fs.accessSync(pathName);

  } catch(err) {
    //console.log(err);
  }

  if(req.method == "GET")
  {
     if(req.headers.cookie)
     {

    let users = req.headers.cookie.split(';');

    let sessionUser = '';

    users.forEach((item) => {
      let c     = item.split('=');
          // console.log(c[1])

      sessionUser = c[1];
    });

      // // setting the file to render
      let fileName = `.sessions/${sessionUser}.txt`;
      
      let contentSession=fs.readFileSync(fileName,  "utf8");

      res.setHeader("x-my-user-data", contentSession);
      
     }

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
      });
      res.end();
    });

  }


});

server.listen(port, (err) => {
  if (err) throw err;
  mlog.info("Server running on port ", port);
});
