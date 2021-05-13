import React from 'react';
import {AddApz} from './apz/citizen/AddApz';

const breadCrumbs = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  let breadCrumbs = document.getElementById('breadCrumbs');
  breadCrumbs.innerHTML = '';
}

const routes = [
  {
    path: '/panel/base-page',
    render: (props) => <AddApz {...props} breadCrumbs={breadCrumbs} />
  },
]

export { routes };