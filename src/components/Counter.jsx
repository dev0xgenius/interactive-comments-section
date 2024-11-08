import { useState } from 'react'
import PropTypes from 'prop-types'
import plusIcon from '../../images/icon-plus.svg'
import minusIcon from '../../images/icon-minus.svg'

export default function Counter(props) {
  return (
    <div className='rounded-xl flex gap-2 p-2.5 bg-white-80 w-32 justify-around items-center'>
      <button
        className='inline-block w-4'
        onClick={() => {}}
      >
        <img src={plusIcon} width='100%' height='auto'/>
      </button>
      <span className='font-extrabold text-blue-300 text-lg'>{props.count}</span>
      <button 
        className='inline-block  w-4'
        onClick={() => {}}
      >
        <img src={minusIcon} width='100%' height='auto'/>
      </button>
    </div>
  );
};

Counter.propTypes = {
  count: PropTypes.number.isRequired
};