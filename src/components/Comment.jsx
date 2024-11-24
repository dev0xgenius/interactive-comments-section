import Counter from './Counter'
import ReplyForm from './ReplyForm'
import UserOptions from './UserOptions'
import UserTag from './UserTag'
import PropTypes from 'prop-types'
import { useState, useContext, useEffect } from 'react'
import { generateID } from '../../utils/helpers'
import { UserContext } from '../../utils/contexts/UserContext'
import { elapsedString } from '../../utils/time'

export default function Comment(props) {
  const loggedUser = useContext(UserContext);
  const [editForm, setEditForm] = useState(false);
  const [formState, setFormState] = useState({
    isOpen: false,
    action: null,
    actionText: "",
    placeholder: "",
    content: "",
    user: {}
  });

  const upVote = () => props.actions.vote(1, props.id);
  const downVote = () => props.actions.vote(-1, props.id);
  const openForm = () => setFormState(fs => ({ ...fs, isOpen: true }));
  const closeForm = () => setFormState(fs => ({ ...fs, isOpen: false }));

  const toggleForm = () => {
    let formOpen = formState.isOpen;
    (formOpen) ? closeForm() : openForm();
  };
  
  const toggleEditForm = () => setEditForm(bool => !bool);

  const addReply = (replyText) => {
    replyText = replyText.replace(/(^@[0-9a-z]+,?)/, "");
    
    const newReply = {
      id: Math.floor(Date.now() / 1000),
      content: replyText,
      createdAt: Date.now(),
      score: 0,
      user: loggedUser,
      replyingTo: props.user.username
    };

    closeForm();
    if (replyText.trim())
      props.actions.addReply(newReply, props.commentID || props.id);
  };

  const deleteReply = () => props.actions.deleteReply(props.id);

  const handleEditedReply = (editedReply) => {
    toggleEditForm();
    editedReply = editedReply.replace(/(^@[0-9a-z]+,?)/, "");
    if(editedReply.trim()) 
      props.actions.editReply(editedReply, props.id);
  };

  const editReply = () => {
    let content = (typeof props.content == 'object') ?
      props.content.props.children[1] : props.content;
      
    if (props.replyingTo) content = `@${props.replyingTo}, ${content}`;
    
    setFormState(fs => (
      {
        ...fs,
        isOpen: !editForm,
        actionText: "UPDATE",
        action: handleEditedReply,
        placeholder: "Edit Your Comment...",
        content: content,
        user: {...loggedUser, image: ""}
      }
    ));
    
    toggleEditForm();
  };
  
  useEffect(() => {
    setFormState(fs => ({
      ...fs,
      user: loggedUser,
      content: `@${props.user.username}, `,
      action: addReply,
      actionText: "REPLY"
    }
    ));
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className="comment rounded-2xl p-5 bg-white-100 h-max">
        <div className="container grid gap-4 h-max
          sm:grid-cols-12 sm:grid-rows-1"
        >
        <div className="content sm:col-start-2 sm:col-span-full 
            flex flex-col gap-4 sm:row-start-1 sm:pl-5">
            <header>
              <div className="comment-info flex gap-4 items-center">
                <UserTag user={props.user} />
                <span className='text-blue-500'>
                  {elapsedString(new Date(props.createdAt))}
                </span>
              </div>
            </header>
            <main>
              {
                (editForm) ?
                  <ReplyForm
                    keepOpen={formState.isOpen}
                    action={formState.action}
                    content={formState.content}
                    placeholder={formState.placeholder}
                    actionText={formState.actionText}
                    user={formState.user}
                  /> : <p className="text-blue-500">{props.content}</p>
              }
            </main>
          </div>
          <footer className="sm:col-start-1 sm:col-span-full sm:row-start-1">
            <div className="comment-actions w-full flex justify-between sm:items-start">
              <Counter
                count={props.score}
                onPlusClick={upVote}
                onMinusClick={downVote}
              />
              <UserOptions
                user={props.user}
                toggleForm={toggleForm}
                actions={{ deleteReply, editReply }}
              />
            </div>
          </footer>
        </div>
      </div>
      {
        (loggedUser.username === props.user.username) ?
        <></> :
        <div 
           className={
             (formState.isOpen) ? 
              "reply-form bg-white-100 rounded-2xl p-5 w-full" : "hidden"
           }
        >
          <ReplyForm
            keepOpen={formState.isOpen}
            action={formState.action}
            content={formState.content}
            placeholder={formState.placeholder}
            actionText={formState.actionText}
            user={formState.user}
          />
        </div>
      }
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,

  replyingTo: PropTypes.string, // For Comment as Reply
  commentID: PropTypes.number, // For Comment as Reply

  replies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.number.isRequired,
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