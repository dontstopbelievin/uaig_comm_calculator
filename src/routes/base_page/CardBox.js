import React from 'react';
import { NavLink } from 'react-router-dom';

const CardBox = ({customClass, cardColor, cardImg, cardText, cardLink}) => {
  return (
    <div className={`card mt-4 mb-4 ${customClass}`}>
      <div className={`card-image ${cardColor}`}>
        <div className='image-border'>
          <img src={cardImg} alt='true' />
        </div>
      </div>

      <div className='card-body'>
        <p className='card-text'>
          {cardText}
        </p>
      </div>
      <div className='card-button'>
        <NavLink to={cardLink} replace className='btn btn-primary'>Подробнее</NavLink>
      </div>

    </div>
  )
};

export { CardBox }