import Comment from './Comment'

function Replies(props) {
  if (props.data.length == 0) return <></>;
  return (
    <ul className='border-l-2 pl-5 flex flex-col gap-4 py-4'>
    {
      props.data.map(reply => {
        let content=
        <>
          <span className='author text-blue-300'>
            @{reply.replyingTo}
          </span> {reply.content}
        </>;
        return <li key={reply.id}>
          <Comment
            id={reply.id}
            content={content}
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

export function Comments(props) {
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
        <Replies data={comment.replies}/>
      </li>
    );
  })
  
  return (
    <div className="wrapper">
      <ul className='flex flex-col gap-4 py-4'>{ comments }</ul>
    </div>
  );
};