const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const fsPromises = require("fs").promises;

const { updateComment } = require("../shared/utils/helpers.js");

const app = express();

const FILEPATH = path.join(__dirname, "data", "data.json");
const PORT = process.env.PORT || 5173;

let server = {
  version: 0,
  waiting: [],
  cachedData: {},
};

server.waitForChanges = function (time) {
  return new Promise((resolve) => {
    server.waiting.push(resolve);

    setTimeout(() => {
      if (!server.waiting.includes(resolve)) return;
      server.waiting = server.waiting.filter((r) => r != resolve);
      resolve({ status: 304 });
    }, time * 1000);
  });
};

server.updated = function () {
  server.version += 1;

  getData().then((data) => {
    let response = {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ETag: `"${server.version}"`,
        "Cache-Control": "no-store",
      },
    };

    server.waiting.forEach((resolve) => resolve(response));
    server.waiting = [];
    setTimeout(() => saveToDisk(server.cachedData), 1000);
  });
};

server.loadInitialData = (filePath) => {
  let outputBuffer = [];
  const readStream = fs.createReadStream(filePath);
  readStream.on("data", (dataChunk) => outputBuffer.push(dataChunk));
  readStream.on(
    "end",
    () => (server.cachedData = JSON.parse(outputBuffer.toString())),
  );
};

function getData() {
  return Promise.resolve(server.cachedData);
}

async function saveToDisk(data) {
  try {
    await fsPromises.writeFile(FILEPATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e);
  }
}

// Built-in Express Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:4173",
      "https://interactive-comments-section-opal.vercel.app",
    ],
    allowedHeaders: "*",
    exposedHeaders: "*",
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/comments", (req, res) => {
  let tag = /"(.*)"/.exec(req.headers["if-none-match"]);
  let wait = /\bwait=(\d+)/.exec(req.headers["prefer"]);

  if (!tag || Number(tag[1]) != server.version) {
    getData().then((data) => {
      res.writeHead(200, {
        "Content-Type": "application/json",
        ETag: `"${server.version}"`,
        "Cache-Control": "no-store",
      });

      res.end(JSON.stringify(data));
    });
  } else if (!wait) {
    res.statusCode(304).end();
  } else {
    server.waitForChanges(Number(wait[1])).then((response) => {
      res = Object.assign(res, response);
      res.end();
    });
  }
});

app.put("/api/comments/add", (req, res) => {
  let newComment = req.body;

  if (newComment != null) {
    getData().then((data) => {
      let updatedComments = [...data.comments, newComment];
      server.cachedData = { ...data, comments: updatedComments };
      server.updated();
      res.status(200).end();
    });
  }
});

app.post("/api/comment/add/reply", (req, res) => {
  let newReply = req.body;

  if (newReply != null) {
    getData().then((data) => {
      let updatedComments = data.comments.map((comment) => {
        if (comment.id === newReply.commentID) {
          delete newReply.commentID;
          let updatedReplies = comment.replies.concat(newReply);
          return Object.assign({}, comment, { replies: updatedReplies });
        }
        return comment;
      });

      server.cachedData = { ...data, comments: updatedComments };
      server.updated();
      res.status(200).end();
    });
  }
});

app.post("/api/comment/edit", (req, res) => {
  let { id, edit } = req.body;
  let { comments } = server.cachedData;

  server.cachedData.comments = updateComment(comments, id, ["content", edit]);
  server.updated();
  res.status(200).end();
});

app.post("/api/comment/vote", (req, res) => {
  let voteInfo = req.body;
  if (voteInfo) {
    let { count, id } = voteInfo;
    let { comments } = server.cachedData;

    server.cachedData.comments = updateComment(comments, id, ["score", count]);
    server.updated();
    res.status(200).end();
  } else res.status(500).res.end();
});

app.delete("/api/comments/delete/:id", (req, _) => {
  let { id } = req.params;

  getData().then((data) => {
    let updatedComments = data.comments.filter((comment) => {
      if (comment.replies.length != 0) {
        comment.replies = comment.replies.filter((reply) => reply.id != id);
      }
      return comment.id != id;
    });

    server.cachedData = { ...data, comments: updatedComments };
    server.updated();
  });
});

server.loadInitialData(FILEPATH);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
