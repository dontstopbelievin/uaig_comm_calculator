import React from 'react';
import { NavLink } from 'react-router-dom';

const TokenAlert = ({ token }) => {
  return (
    token ? null : (
      <div className='alert alert-danger' role='alert'>
        Для работы в системе необходимо <NavLink to={'/panel/common/login'}>войти </NavLink>
        или <NavLink to={'/panel/common/register'}>зарегистрироваться</NavLink>.
      </div>
    )
  )
};

export { TokenAlert }