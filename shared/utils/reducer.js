import { updateComment } from "../../client/src/utils/helpers";

export default function reducer(state, action) {
  switch (action.type) {
    case "ADD_COMMENT":
      return {
        ...state,
        comments: state.comments.concat(action.data),
      };
    case "ADD_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.data.commentID) {
            comment.replies = comment.replies.concat(action.data);
          }

          return comment;
        }),
      };
    case "DELETE_REPLY":
      let updatedComments = state.comments.map((comment) => {
        if (comment.id !== action.data.id) {
          comment.replies =
            comment.replies.length > 0
              ? comment.replies.filter((reply) => reply.id !== action.data.id)
              : comment.replies;
        }

        if (comment.id === action.data.id) return undefined;
        return comment;
      });

      return {
        ...state,
        comments: updatedComments.filter(
          (comment) => typeof comment != "undefined",
        ),
      };
    case "EDIT_REPLY":
      return {
        ...state,
        comments: updateComment(state.comments, action.data.id, [
          action.data.content ? "content" : "score",
          action.data.content || action.data.score,
        ]),
      };
    default:
      throw "Unknown Action";
  }
}
