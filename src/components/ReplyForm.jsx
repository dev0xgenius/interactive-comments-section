import PropTypes from 'prop-types'
import { useContext } from 'react';
import { UserContext } from '../../utils/contexts/UserContext';

export default function ReplyForm(props) {
  const user = useContext(UserContext);
  
  const submitReply = (evt) => {
    evt.preventDefault(); // Prevent default event handler
    
    let formData = new FormData(evt.target);
    let replyContent = formData.get("content");
    
    evt.target.querySelector("[name='content']").value = "";
    if (props.action && replyContent.trim()) props.action(replyContent);
  };
  
  return (props.keepOpen) ? (
    <form onSubmit={submitReply}
      className='wrapper bg-white-100 rounded-2xl p-5'>
      <div className='grid gap-4'>
        <textarea
          name='content' 
          className='rounded-xl w-full border px-5 py-2.5 resize-none h-20'
          placeholder={props.placeholder || "Reply..."}
        >{props.content}</textarea>
        <span className='flex justify-between items-center'>
          <span className='inline-block w-8'>
            <img src={user.image.png} width='100%' height='auto' />
          </span>
          <button
            type='submit'
            className='rounded-xl bg-blue-300 w-32 font-bold text-white-100 p-4'
          >
            SEND
          </button>
        </span>
      </div>
    </form>
  ) : <></>;
};

ReplyForm.propTypes = {
  content: PropTypes.string,
  action: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  keepOpen: PropTypes.bool.isRequired
};