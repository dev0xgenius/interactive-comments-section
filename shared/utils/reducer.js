import { updateComment } from "../../client/src/utils/helpers";

export default function reducer(state, action) {
    let { type, data } = action;

    if (typeof data == "string") data = JSON.parse(data);

    switch (type) {
        case "ADD_COMMENT":
            return state.concat(data);
        case "ADD_REPLY":
            let result = updateComment(state, data.commentID, [
                "replies",
                (matchedComment) => {
                    matchedComment.replies =
                        matchedComment.replies.concat(data);

                    return matchedComment.replies;
                },
            ]);

            return result;
        case "DELETE_REPLY":
            return state.filter((comment) => {
                if (comment.id === data.id) return false;
                if (comment.replies) {
                    comment.replies = comment.replies.filter(
                        (reply) => reply.id !== data.id
                    );
                }

                return true;
            });
        case "EDIT_REPLY":
            return updateComment(state, data.id, [
                data.content ? "content" : "score",
                data.content || data.score,
            ]);
    }
}
