const BASE_URL = "";//"interactive-comments-section-0xgenius.vercel.app";

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
  fetch(`${BASE_URL}/api/comments/add`, {
    headers: {"Content-Type" : "application/json"},
    method: "PUT",
    body: JSON.stringify(comment),
  }).then(response => console.log(response.statusText))
    .catch(err => "Couldn't fetch data...");
}

function addReply(reply, commentID) {
  reply.commentID = commentID;
  fetch(`${BASE_URL}/api/comment/add/reply`, {
    headers: {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify(reply),
  }).catch(err => console.error("Couldn't add reply"));
}

function deleteReply(replyID) {
  fetch(`${BASE_URL}/api/comments/delete`, {
    headers: {"Content-Type" : "application/json"},
    method: "DELETE",
    body: replyID
  }).catch(err => console.error("Couldn't complete the operation"));
}

function editComment(id, edit) {
  fetch(`${BASE_URL}/api/comment/edit`, {
    headers : {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify({id, edit})
  }).catch(err => console.error(err));
}

function vote(newCount, id) {
  fetch(`${BASE_URL}/api/comment/vote`, {
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