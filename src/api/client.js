async function getComments(success, controller={signal: null}) {
  let tag;
  for (;;) {
    let response;
    try {
      response = await fetch("/api/comments", {
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
  fetch('/api/comments/add', {
    headers: {"Content-Type" : "application/json"},
    method: "PUT",
    body: JSON.stringify(comment),
  }).then(response => console.log(response.statusText))
    .catch(err => "Couldn't fetch data...");
}

function addReply(reply, commentID) {
  reply.commentID = commentID;
  fetch("/api/comments/add/reply", {
    headers: {"Content-Type" : "application/json"},
    method: "POST",
    body: JSON.stringify(reply),
  }).catch(err => console.error("Fucking hell mate!!!"));
}

export default {
  getComments,
  addComment,
  addReply
};