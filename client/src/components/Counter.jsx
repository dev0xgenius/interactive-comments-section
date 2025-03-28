import { useState } from 'react'
import PropTypes from 'prop-types'
import plusIcon from '/images/icon-plus.svg'
import minusIcon from '/images/icon-minus.svg'

export default function Counter({count, onMinusClick, onPlusClick}) {
  return (
    <div className='rounded-xl flex gap-2 p-2.5 bg-white-80 
        max-w-32 w-full justify-around items-center sm:flex-col 
        sm:w-1/12 sm:h-32 sm:self-center'
      >
      <button
        className='inline-block max-w-4 w-full min-w-2'
        onClick={onPlusClick}
      >
        <img src={plusIcon} width='100%' height='auto'/>
      </button>
      <span className='font-extrabold text-blue-300 text-lg'>{count}</span>
      <button 
        className='inline-block max-w-4 w-full min-w-2'
        onClick={onMinusClick}
      >
        <img src={minusIcon} width='100%' height='auto'/>
      </button>
    </div>
  );
};

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  onMinusClick: PropTypes.func.isRequired,
  onPlusClick: PropTypes.func.isRequired
};