import { UserContext } from '../../utils/contexts/UserContext'
import { useContext } from 'react'

export default function UserTag({ user }) {
  const loggedUser = useContext(UserContext);
  return (
    <span className="user flex gap-4 items-center">
      <span className='inline-block w-8 h-8'>
        <img src={user.image.png} width='100%' height='auto'/>
      </span>
      <span className='flex gap-2 justify-center items-center'>
        <span className='author'>{user.username}</span>
        {
          (user.username === loggedUser.username) ?
            <span 
              className="bg-blue-300 text-white-100 text-sm
              rounded-sm px-2 py-0.25 pb-0.5 font-bold tracking-wider">you
            </span> : <></>
        }
      </span>
    </span>
  );
}