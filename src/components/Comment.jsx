import PropTypes from 'prop-types'
import Counter from './Counter.jsx'
import ReplyForm from './ReplyForm.jsx'
import { useState } from 'react'

export default function Comment(props) {
  const [formOpen, setFormOpen] = useState(false);
  const toggleForm = () => setFormOpen(currentState => !currentState);
  
  return (
    <div className='flex flex-col gap-4'>
      <div className="comment rounded-2xl p-5 bg-white-100 h-max">
        <div className="container grid gap-4 h-max">
          <header>
            <div className="comment-info flex gap-4 items-center">
              <span className="user flex gap-4 items-center">
                <span className='inline-block w-8 h-8'>
                  <img src={props.user.image.png} width='100%' height='auto'/>
                </span>
                <span className='author'>{props.author}</span>
              </span>
              <span className='text-blue-500'>{props.createdAt}</span>
            </div>
          </header>
          <main>
            <p className='text-blue-500'>{props.content}</p>
          </main>
          <footer>
            <div className="comment-actions w-full flex justify-between">
              <Counter count={props.score}/>
              <button 
                className='flex items-center gap-2'
                onClick={toggleForm}
              >
                <i className='w-4'>
                  <img src='../../images/icon-reply.svg'
                    width="100%" height="auto"/>
                </i>
                <span className='font-extrabold text-blue-300'>Reply</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
      <ReplyForm 
        user={props.user}
        keepOpen={formOpen}
      />
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      replyingTo: PropTypes.string.isRequired
    })
  ),
  
  user: PropTypes.shape({
    image: { 
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp"
    },
    username: "juliusomo"
  }).isRequired
};