import Counter from './Counter'
import ReplyForm from './ReplyForm'
import UserOptions from './UserOptions'
import UserTag from './UserTag'
import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { generateID } from '../../utils/helpers.js'
import { UserContext } from '../../utils/contexts/UserContext'

export default function Comment(props) {
  const [formOpen, setFormOpen] = useState(false);
  const loggedUser = useContext(UserContext);
  
  const toggleForm = () => setFormOpen(currentState => !currentState);
  
  const addReply = (replyText) => {
    const newReply = {
      id: Math.floor(Date.now() / 1000),
      content: replyText,
      createdAt: "Now",
      score: 0,
      user: loggedUser,
      replyingTo: props.user.username
    };
    
    toggleForm();
    props.actions.addReply(newReply, props.commentID || props.id);
  };
  
  return (
    <div className='flex flex-col gap-4'>
      <div className="comment rounded-2xl p-5 bg-white-100 h-max">
        <div className="container grid gap-4 h-max">
          <header>
            <div className="comment-info flex gap-4 items-center">
              <UserTag user={props.user}/>
              <span className='text-blue-500'>{props.createdAt}</span>
            </div>
          </header>
          <main>
            <p className='text-blue-500'>{props.content}</p>
          </main>
          <footer>
            <div className="comment-actions w-full flex justify-between">
              <Counter count={props.score}/>
              <UserOptions 
                user={props.user}
                toggleForm={toggleForm}
              />
            </div>
          </footer>
        </div>
      </div>
      <ReplyForm
        keepOpen={formOpen}
        action={addReply}
      />
    </div>
  );
};

Comment.propTypes = {
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
  }).isRequired,
  
  actions: PropTypes.arrayOf(PropTypes.func)
};