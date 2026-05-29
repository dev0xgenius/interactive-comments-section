import { motion } from "motion/react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import Replies from "./Replies.jsx";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.03,
        },
    },
};

export default function Comments(props) {
    let comments = props.data.sort((a, b) => b.score - a.score);

    comments = comments.map((comment) => {
        return (
            <motion.li
                key={comment.id}
                layout
                variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.15, ease: "easeOut" },
                    },
                }}
            >
                <Comment
                    id={comment.id}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    score={comment.score}
                    user={comment.user}
                    replies={comment.replies}
                    actions={props.actions}
                />

                {comment.replies.length > 0 && (
                    <div className="sm:pl-12 sm:mt-6 my-5">
                        <Replies
                            replies={comment?.replies}
                            actions={props.actions}
                            targetUser={comment.user.username}
                        />
                    </div>
                )}
            </motion.li>
        );
    });

    return (
        <div className="wrapper w-full">
            <motion.ul
                className="flex flex-col gap-4 py-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {comments}
            </motion.ul>
        </div>
    );
}

Comments.propTypes = {
    actions: PropTypes.shape({
        handleReply: PropTypes.func,
        editReply: PropTypes.func,
        deleteReply: PropTypes.func,
        vote: PropTypes.func,
    }).isRequired,

    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            createdAt: PropTypes.number.isRequired,
            score: PropTypes.number.isRequired,

            replies: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    content: PropTypes.string.isRequired,
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
            ),

            user: PropTypes.shape({
                image: PropTypes.shape({
                    png: PropTypes.string,
                    webp: PropTypes.string,
                }),
                username: PropTypes.string,
            }).isRequired,
        }),
    ),
};
