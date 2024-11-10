import PropTypes from 'prop-types'
import Comment from './Comment'
import Replies from './Replies.jsx'

export default function Comments(props) {
  let comments = props.data;
  comments = comments.map(comment => {
    return (
      <li key={comment.id}>
        <Comment
          id={comment.id}
          content={comment.content}
          createdAt={comment.createdAt}
          score={comment.score}
          user={comment.user}
        />
        <Replies data={comment.replies} />
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