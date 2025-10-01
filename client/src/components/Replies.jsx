import PropTypes from "prop-types";
import Comment from "./Comment";

export default function Replies({ replies, actions }) {
    let sortedReplies = replies.sort((a, b) => a.createdAt - b.createdAt);

    return replies?.length == 0 ? (
        <></>
    ) : (
        <ul
            className="border-l-2 pl-5 flex flex-col gap-4
          sm:py-0 sm:pl-12"
        >
            {sortedReplies.map((reply) => {
                return (
                    <li key={reply.id}>
                        <Comment
                            id={reply.id}
                            content={reply.content}
                            createdAt={reply.createdAt}
                            score={reply.score}
                            user={reply.user}
                            siblings={replies}
                            replyingTo={reply.replyingTo}
                            commentID={reply.commentID}
                            actions={actions}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

const dataShape = PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired || PropTypes.shape({}),
        createdAt: PropTypes.number.isRequired,
        score: PropTypes.number.isRequired,
        replyingTo: PropTypes.string.isRequired,

        user: PropTypes.shape({
            image: PropTypes.shape({
                png: PropTypes.string,
                webp: PropTypes.string,
            }),
            username: PropTypes.string,
        }).isRequired,
    })
);

Replies.propTypes = {
    actions: PropTypes.shape({
        addReply: PropTypes.func,
        deleteReply: PropTypes.func,
        editReply: PropTypes.func,
    }),

    commentID: PropTypes.number.isRequired,
    replies: dataShape,
    data: dataShape,
};
