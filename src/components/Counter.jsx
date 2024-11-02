import plusIcon from '../../images/icon-plus.svg'
import minusIcon from '../../images/icon-minus.svg'

export default function Counter(props) {
  return (
    <div className='rounded-xl flex gap-4 p-3 bg-white-80 w-32 justify-around items-center'>
      <i className='w-4'>
        <img src={plusIcon} width='100%' height='auto'/>
      </i>
      <span className='font-bold text-blue-300'>{props.count}</span>
      <i className='w-4'>
        <img src={minusIcon} width='100%' height='auto'/>
      </i>
    </div>
  );
};