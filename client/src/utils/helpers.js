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
    let updatedComments = [...comments].map((comment) => {
        if (!Object.hasOwn(comment, property)) return comment;
        let updatedComment = { ...comment };

        if (comment.id === id) {
            updatedComment[property] = value;
            if (typeof value == "function") {
                updatedComment[property] = value(comment);
            }

            return updatedComment;
        } else if (!comment.replies) return comment;

        let { replies } = comment;
        updatedComment.replies = updateComment(replies, id, [property, value]);

        return updatedComment;
    });

    return updatedComments;
}

export { generateID, updateComment };
