import PropTypes from 'prop-types'

export default function ReplyForm({user, placeholder, keepOpen}) {
  return (keepOpen) ? (
    <div className='wrapper bg-white-100 rounded-2xl p-5'>
      <form className='grid gap-4'>
        <textarea className='rounded-xl w-full border px-5 py-2.5 resize-none h-20'
          placeholder={placeholder || "Reply..."}>
        </textarea>
        <span className='flex justify-between items-center'>
          <span className='inline-block w-8'>
            <img src={user.image.png} width='100%' height='auto'/>
          </span>
          <button className='rounded-xl bg-blue-300 w-32 font-bold text-white-100 p-4'>SEND</button>
        </span>
      </form>
    </div>
  ) : <></>;
};

ReplyForm.propTypes = {
  user: PropTypes.shape({
    image: { 
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp"
    },
    username: "juliusomo"
  }).isRequired,
  
  placeholder: PropTypes.string,
  keepOpen: PropTypes.bool.isRequired
};