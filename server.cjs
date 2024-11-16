const express = require('express');
const ViteExpress = require('vite-express');
const fs = require('fs');
const fsPromises = require("fs").promises;
const path = require('path');

const app = express();

const FILEPATH = path.join(process.env.PWD, "data.json");
const PORT = process.env.PORT || 5173;

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
    try { 
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
    } catch(e) { console.error(e); }
  });
}

app.get("/api/comments", (req, res) => {
  let tag = /"(.*)"/.exec(req.headers["if-none-match"]); 
  let wait = /\bwait=(\d+)/.exec(req.headers.Prefer);
  
  if (!tag || Number(tag[1]) != server.version) {
    getJSON(FILEPATH).then(data => {
      res.writeHead(200, {
        "Content-Type" : "application/json",
        "ETag" : `"${server.version}"`,
        "Cache-Control" : "no-store"
      });
      
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
        res.status(200);
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

app.post("/api/comments/add/reply", (req, res) => {
  let newReply = null;
  req.on("data", dataChunk => newReply = JSON.parse(dataChunk.toString()));
  req.on('end', () => {
    if (newReply != null) {
      getJSON(FILEPATH).then(data => {
        res.status(200);
        let updatedComments = data.comments.map(comment => {
          if (comment.id === newReply.commentID) {
            delete newReply.commentID;
            let updatedReplies = comment.replies.concat(newReply);
            return Object.assign({}, comment, 
              { replies: updatedReplies }
            ); 
          }
          return comment;
        }); let updatedData = {...data, comments: updatedComments};
        
        fsPromises.writeFile(
          FILEPATH,
          JSON.stringify(updatedData, null, 2)
        ).catch(err => console.log(`Fatal Error: ${err}`));
        
        server.updated();
      }).catch(err => console.log(err));
    }
  });
});

app.delete("/api/comments/delete", (req, res) => {
  let replyID = NaN;
  req.on('data', data => replyID = Number(data.toString()));
  req.on('end', () => {
    getJSON(FILEPATH).then(data => {
      let updatedComments = data.comments.filter(comment => {
        if (comment.replies.length != 0)
          comment.replies = comment.replies.filter(reply => reply.id != replyID);
        return (comment.id != replyID);
      }); let updatedData = {...data, comments: updatedComments};
      
      fsPromises.writeFile(
        FILEPATH,
        JSON.stringify(updatedData, null, 2)
      ).catch(err => console.log(`Fatal Error: ${err}`));
      
      server.updated();
    }).catch(err => console.error(err));
  });
});

ViteExpress.listen(app, PORT, () => console.log(`Server running on ${PORT}`));