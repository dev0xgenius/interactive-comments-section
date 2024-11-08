const express = require('express');
const ViteExpress = require('vite-express');
const fs = require('fs');
const fsPromises = require("fs").promises;
const path = require('path');

const app = express();

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

app.get("/api/comments", (_, res) => {
  let filePath = path.join(process.env.PWD, 'data.json');
  if (!fs.existsSync(filePath)) {
    res.statusCode = 304;
    return;
  }
  
  fs.readFile(filePath, "utf-8", (error, data) => {
    if (error) console.error(error);
    res.writeHead(200, {"Content-Type":"application/json"});
    res.end(data);
  });
});

app.put("/api/comments/add", (req, res) => {
  let newComment = null;
  req.on("data", dataChunk => {
    newComment = JSON.parse(dataChunk.toString());
    
    if (newComment != null) {
      let filePath = path.join(process.env.PWD, 'data.json');
      
      getJSON(filePath).then(data => {
        let updatedComments = [...data.comments, newComment];
        let updatedData = {...data, comments: updatedComments};
        
        fsPromises.writeFile(
          filePath,
          JSON.stringify(updatedData, null, 2)
        ).catch(err => console.log(`Fatal Error: ${err}`));
        
      }).catch(err => console.log(err));
    }
  });
  
  res.statusCode = 200;
  res.end();
});

ViteExpress.listen(app, 5173, () => console.log("Server is listening..."));