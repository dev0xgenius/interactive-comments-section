const express = require('express');
const ViteExpress = require('vite-express');
const fs = require('fs');
const fsPromises = require("fs").promises;
const path = require('path');

const app = express();

const FILEPATH = path.join(process.env.PWD, "data.json");

let server = {
  version: 0,
  waiting: [],
};

server.waitForChanges = function(time) {
  return new Promise(resolve => {
    server.waiting.push(resolve);
    setTimeout(() => {
      if (!server.waiting.includes(resolve)) return;
      server.waiting = server.waiting.filter(r => r != resolve);
      resolve({status: 304});
    }, time * 1000);
  });
};

server.updated = function() {
  server.version += 1;
  getJSON(FILEPATH)
    .then(data => {
      let response = {
        body: JSON.stringify(data),
        headers: {
          "Content-Type" : "application/json",
          "ETag" : `"${server.version}"`,
          "Cache-Control" : "no-store"
          }
      };
      
      server.waiting.forEach(resolve => resolve(response));
    });
    
  server.waiting = [];
};

function getJSON(jsonFile) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(jsonFile);
    
    let streamOutput = null;
    readStream.on("data", dataChunk => 
      streamOutput = dataChunk.toString());
      
    readStream.on('end', (err) => {
      if (err) reject("Something bad occured...");
      
      streamOutput = JSON.parse(streamOutput);
      if (streamOutput != null) resolve(streamOutput);
      else reject("Couldn't parse file...");
    });
  });
}

app.get("/api/comments", (req, res) => {
  let tag = /"(.*)"/.exec(req.headers["if-none-match"]); 
  let wait = /\bwait=(\d+)/.exec(req.headers.Prefer);
  
  if (!tag || Number(tag[1]) != server.version) {
    getJSON(path.join(process.env.PWD, 'data.json'))
      .then(data => {
        res.writeHead(200, {
          "Content-Type" : "application/json",
          "ETag" : `"${server.version}"`,
          "Cache-Control" : "no-store"
        });
        
        //res.body = JSON.stringify(data);
        res.status = 200;
        res.end(JSON.stringify(data));
      });
  } else if (!wait) { res.status = 304; }
  else { 
    server.waitForChanges(Number(wait[1]))
      .then(response => {
        Object.assign(res, response);
        res.end();
      });
  }
});

app.put("/api/comments/add", (req, res) => {
  let newComment = null;
  req.on("data", dataChunk => {
    newComment = JSON.parse(dataChunk.toString());
    
    if (newComment != null) {
      getJSON(FILEPATH).then(data => {
        res.statusCode = 200;
        let updatedComments = [...data.comments, newComment];
        let updatedData = {...data, comments: updatedComments};
        
        fsPromises.writeFile(
          FILEPATH,
          JSON.stringify(updatedData, null, 2)
        ).catch(err => console.log(`Fatal Error: ${err}`));
        
        server.updated();
      }).catch(err => console.log(err));
    }
  });
});

ViteExpress.listen(app, 5173, () => console.log(`Server running on 5173`));