import { UserContext } from '../../utils/contexts/UserContext'
import { useContext } from 'react';

export default function UserOptions(props) {
  const loggedUser = useContext(UserContext);

  return (props.user.username == loggedUser.username) ?
    (
      <div className='flex items-center gap-4'>
        <button 
          className='flex items-center gap-2'
          onClick={props.actions.deleteReply}
          >
          <i className='w-4'>
            <img src="../../images/icon-delete.svg" 
              width="100%" height="auto" />
          </i>
          <span className='font-semibold text-red-100'>Delete</span>
        </button>
        <button className='flex items-center gap-2'>
          <i className='w-4'>
            <img src="../../images/icon-edit.svg" 
              width="100%" height="auto" />
          </i>
          <span className='font-semibold text-blue-300'>Edit</span>
        </button>
      </div>
    ) : (
      <button
        className='flex items-center gap-2'
        onClick={props.toggleForm}
      >
        <i className='w-4'>
          <img src='../../images/icon-reply.svg'
            width="100%" height="auto" />
        </i>
        <span className='font-semibold text-blue-300'>Reply</span>
      </button>
    );
};