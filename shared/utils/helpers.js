const generateID = (objArray, usedIDs = new Set([])) => {
  let newID = null;
  let idExists = false;
  do {
    newID = Math.floor(Date.now() / 1000);
  } while (usedIDs.has(newID));

  // Add matching ID into usedIDs 'Set Object' for tracking
  for (const item of objArray) {
    const { id } = item;
    if (Number(id) === newID) {
      idExists = true;
      usedIDs.add(Number(id));
    }
  }
  return idExists ? generateID(objArray, usedIDs) : newID;
};

function updateComment(comments, id, [property, value]) {
  let updatedComments = comments.map((comment) => {
    if (!(property in comment)) return comment;
    let updatedComment = { ...comment };

    if (comment.id === id) {
      updatedComment[property] =
        typeof value == "function" ? value(comment) : value;
    } else if (comment.id !== id && !comment.replies) return comment;
    else if (comment.replies) {
      let { replies } = comment;
      replies = replies.map((reply) => {
        let updatedReply = { ...reply };
        if (reply.id === id) {
          updatedReply[property] =
            typeof value == "function" ? value(reply) : value;
        }

        return updatedReply;
      });

      updatedComment.replies = replies;
    }
    return updatedComment;
  });

  return updatedComments;
}

export { generateID, updateComment, reducer };

