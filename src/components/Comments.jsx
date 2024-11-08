import PropTypes from 'prop-types'
import Comment from './Comment'

function Replies(props) {
  const replyText = (replyingTo, content) => {
    return (
      <>
        <span className='author text-blue-300'>
          @{replyingTo}
        </span> {content}
      </>
    )
  };

  return (props.data.length == 0) ?
    <></> : (
      <ul className='border-l-2 pl-5 flex flex-col gap-4 py-4'>
        {
          props.data.map(reply => {
            return <li key={reply.id}>
              <Comment
                id={reply.id}
                content={replyText(reply.replyingTo, reply.content)}
                createdAt={reply.createdAt}
                score={reply.score}
                user={reply.user}
                author={reply.user.username}
              />
            </li>
          })
        }
      </ul>
    );
}

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
          author={comment.user.username}
          replies={comment.replies}
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
      author: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,

      replies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          author: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          score: PropTypes.number.isRequired,
          replyingTo: PropTypes.string.isRequired
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

Replies.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      author: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,

      replies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          author: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          score: PropTypes.number.isRequired,
          replyingTo: PropTypes.string.isRequired
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