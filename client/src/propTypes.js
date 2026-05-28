import PropTypes from "prop-types";

export const commentPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,

    user: PropTypes.shape({
        image: PropTypes.shape({
            png: PropTypes.string.isRequired,
            webp: PropTypes.string,
        }),

        username: PropTypes.string,
    }),

    actions: PropTypes.objectOf({
        handleReply: PropTypes.func,
        editReply: PropTypes.func,
        deleteReply: PropTypes.func,
        addReply: PropTypes.func,
        vote: PropTypes.func,
    }),
});
