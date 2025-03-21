<<<<<<< HEAD:src/api/client.js
const BASE_URL = ""; //"https://interactive-comments-section-0xgenius.vercel.app";
=======
const BASEURL = "https://zeroxg3nius-comment-section.onrender.com";

async function apiRequest(url, requestObj) {
  return await fetch(`${BASEURL}${url}`, requestObj);
}
>>>>>>> dev:client/src/api/client.js

async function getComments(success, controller) {
  let tag;
  for (;;) {
    let response;
    try {
      response = await fetch(`${BASE_URL}/api/comments`, {
        headers: tag && {
          Accept: "application/json",
          "If-None-Match": tag,
          Prefer: "wait=90",
        },
        signal: controller.signal
      });
    } catch(e) {
      console.log(`Response failed: ${e}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pauses program for 0.5s
      continue;
    }
    
    if (response.status == 304) continue;
    tag = response.headers.get("ETag");
    
    if (
      response.ok && 
      response.headers.get("Content-Type") == "application/json") 
    {
      let data = await response.json();
      success(data);
    }
  }
}

function addComment(comment){
<<<<<<< HEAD:src/api/client.js
  fetch(`${BASE_URL}/api/comments/add`, {
=======
  apiRequest('/api/comments/add', {
>>>>>>> dev:client/src/api/client.js
    headers: {"Content-Type" : "application/json"},
    method: "PUT",
    body: JSON.stringify(comment),
  }).then(response => console.log(response.statusText))
    .catch(err => "Couldn't fetch data...");
}

function addReply(reply, commentID) {
  reply.commentID = commentID;
<<<<<<< HEAD:src/api/client.js
  fetch(`${BASE_URL}/api/comment/add/reply`, {
=======
  apiRequest("/api/comment/add/reply", {
>>>>>>> dev:client/src/api/client.js
    headers: {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify(reply),
  }).catch(err => console.error("Couldn't add reply"));
}

function deleteReply(replyID) {
<<<<<<< HEAD:src/api/client.js
  fetch(`${BASE_URL}/api/comments/delete`, {
    headers: {"Content-Type" : "application/json"},
=======
  apiRequest("api/comments/delete", {
    headers: {"Content-Type" : "text/plain"},
>>>>>>> dev:client/src/api/client.js
    method: "DELETE",
    body: replyID,
  }).catch(err => console.error("Couldn't complete the operation"));
}

function editComment(id, edit) {
<<<<<<< HEAD:src/api/client.js
  fetch(`${BASE_URL}/api/comment/edit`, {
=======
  apiRequest("/api/comment/edit", {
>>>>>>> dev:client/src/api/client.js
    headers : {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify({id, edit})
  }).catch(err => console.error(err));
}

function vote(newCount, id) {
<<<<<<< HEAD:src/api/client.js
  fetch(`${BASE_URL}/api/comment/vote`, {
=======
  apiRequest("/api/comment/vote", {
>>>>>>> dev:client/src/api/client.js
    headers : {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify({count: newCount, id})
  }).catch(err => console.log(err)); 
}

export default {
  getComments,
  editComment,
  deleteReply,
  addComment,
  addReply,
  vote
};