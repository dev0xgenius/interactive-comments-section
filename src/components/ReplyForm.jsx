export default function ReplyForm(props) {
  return (
    <div className='wrapper bg-white-100 rounded-2xl p-5'>
      <form className='grid gap-4'>
        <textarea className='rounded-xl w-full border p-5 resize-none h-32'
          placeholder="Add a comment...">
        </textarea>
        <span className='flex justify-between items-center'>
          <span className='inline-block w-8'>
            <img src={props.user.image.png} width='100%' height='auto'/>
          </span>
          <button className='rounded-xl bg-blue-300 w-32 font-bold text-white-100 p-4'>SEND</button>
        </span>
      </form>
    </div>
  );
};