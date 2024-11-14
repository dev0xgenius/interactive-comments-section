import PropTypes from 'prop-types'
import Comment from './Comment'

export default function Replies({data, commentID, actions}) {
  const replyText = (replyingTo, content) => {
  return (
    <>
      <span className='author text-blue-300'>
      @{replyingTo}</span> {content}
    </>
    );
  };

  return (data.length == 0) ?
    <></> : (
    <ul className='border-l-2 pl-5 flex flex-col gap-4 py-4'>
      {
        data.map(reply => {
          return <li key={reply.id}>
            <Comment
              id={reply.id}
              content={replyText(reply.replyingTo, reply.content)}
              createdAt={reply.createdAt}
              score={reply.score}
              user={reply.user}
              
              commentID={commentID}
              actions={actions}
            />
          </li>
        })
      }
    </ul>
  );
}

Replies.propTypes = {
  handleReply: PropTypes.func,
  commentID: PropTypes.number.isRequired,
  
  data: PropTypes.arrayOf(
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
  )
};