import React from 'react';
import background from '../../assets/background.png';

const Background = () => {
  return (
    <div className='w-full h-full'>
      <img  
        src={background}
        alt='Background'
        className='fixed left-0 z-[-1] w-full h-full object-cover opacity-36'
      />
      <div className='fixed inset-0 z-[-2] bg-white'></div>
    </div>
  );
};

export default Background;