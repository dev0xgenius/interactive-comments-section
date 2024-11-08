function getComments(success=() => {}, controller={signal: null}) {
  return fetch("/api/comments", {
    headers: { Accept: "application/json" },
    signal: controller.signal
  }).catch(err => alert(`Couldn't fetch data: ${err}`))
    .then(checkStatus)
    .then(parseJSON)
    .then(success);
}

function checkStatus(response) {
  if (response.ok && 
    response.headers.get("Content-Type") === "application/json") 
    return response.text();
  else console.log(response.statusText);
}

function parseJSON(data) {
  return JSON.parse(data);
}

function addComment(comment){
  fetch('/api/comments/add', {
    headers: {"Content-Type" : "application/json"},
    method: "PUT",
    body: JSON.stringify(comment),
  }).then(response => console.log(response.statusText))
    .catch(err => "Couldn't fetch data...");
}

export default {
  getComments,
  addComment
};