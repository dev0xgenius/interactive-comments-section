import { useState } from 'react'
import PropTypes from 'prop-types'
import plusIcon from '../../images/icon-plus.svg'
import minusIcon from '../../images/icon-minus.svg'

export default function Counter(props) {
  const [countValue, setCountValue] = useState(props.count);
  const count = (num) => setCountValue(countValue => countValue + (num)); // When using, enter a number with either '-' or '+' to count down or up respectively
  
  return (
    <div className='rounded-xl flex gap-2 p-2.5 bg-white-80 w-32 justify-around items-center'>
      <button
        className='inline-block w-4'
        onClick={() => count(1)}
      >
        <img src={plusIcon} width='100%' height='auto'/>
      </button>
      <span className='font-extrabold text-blue-300 text-lg'>{countValue}</span>
      <button 
        className='inline-block  w-4'
        onClick={() => count(-1)}
      >
        <img src={minusIcon} width='100%' height='auto'/>
      </button>
    </div>
  );
};

Counter.propTypes = {
  count: PropTypes.number.isRequired
};