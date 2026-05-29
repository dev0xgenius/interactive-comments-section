import { motion } from "motion/react";
import PropTypes from "prop-types";
import Comment from "./Comment";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.02,
        },
    },
};

export default function Replies({ replies, actions }) {
    let sortedReplies = replies.sort((a, b) => a.createdAt - b.createdAt);

    return replies?.length == 0 ? (
        <></>
    ) : (
        <motion.ul
            className="border-l-2 border-blue-200/40 pl-5 flex flex-col gap-4
          sm:py-0 sm:pl-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {sortedReplies.map((reply) => {
                return (
                    <motion.li
                        key={reply.id}
                        variants={{
                            hidden: { opacity: 0, y: 4 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.12, ease: "easeOut" },
                            },
                        }}
                    >
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
                    </motion.li>
                );
            })}
        </motion.ul>
    );
}

const dataShape = PropTypes.arrayOf(
    PropTypes.shape({
        id: PropTypes.string.isRequired,
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
    }),
);

Replies.propTypes = {
    actions: PropTypes.shape({
        addReply: PropTypes.func,
        deleteReply: PropTypes.func,
        editReply: PropTypes.func,
    }).isRequired,

    commentID: PropTypes.number,
    replies: dataShape,
    data: dataShape,
};
