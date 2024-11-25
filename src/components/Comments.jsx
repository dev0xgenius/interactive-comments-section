import PropTypes from 'prop-types'
import Comment from './Comment'
import Replies from './Replies.jsx'

export default function Comments(props) {
  let comments = props.data.sort((a, b) => b.score - a.score);
  comments = comments.map(comment => {
    return (
      <li key={comment.id}>
        <Comment
          id={comment.id}
          content={comment.content}
          createdAt={comment.createdAt}
          score={comment.score}
          user={comment.user}
         // replies={comment.replies}
          
          actions={props.actions}
        />
        <div className={
          (comment.replies.length) ? "sm:pl-12 sm:mt-6 my-5" : "hidden"
        }>
          <Replies 
            replies={comment.replies}
            commentID={comment.id}
            actions={props.actions}
            targetUser={comment.user.username}
          />
        </div>
      </li>
    );
  })

  return (
    <div className="wrapper">
      <ul className='flex flex-col gap-4 py-4'>{comments}</ul>
    </div>
  );
};

Comments.propTypes = {
  handleReply: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,

      replies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          content: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          score: PropTypes.number.isRequired,
          replyingTo: PropTypes.string.isRequired,
          
          user: PropTypes.shape({
            image: {
              png: PropTypes.string,
              webp: PropTypes.string
            },
            username: PropTypes.string
          }).isRequired
        })
      ),

      user: PropTypes.shape({
        image: {
          png: PropTypes.string,
          webp: PropTypes.string
        },
        username: PropTypes.string
      }).isRequired
    })
  )
};