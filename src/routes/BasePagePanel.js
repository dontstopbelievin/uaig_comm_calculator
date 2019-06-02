import React from 'react';
import LocalizedStrings from 'react-localization';
import { ru, kk } from '../languages/guest.json';
import { CardBox, TokenAlert } from './base_page';
const e = new LocalizedStrings({ ru, kk });

const cardBoxes = [
  [
    {
      cardColor: 'card-color-2',
      cardImg: '/images/2.svg',
      cardText: e.secondblock,
      cardLink: '/panel/services/1'
    },
    {
      customClass: 'info-block',
      cardColor: 'card-color-1',
      cardImg: '/images/7.svg',
      cardText: e.homeSketchBlock,
      cardLink: '/panel/services/2'
    },
    {
      cardColor: 'card-color-3',
      cardImg: '/images/3.svg',
      cardText: e.thirdblock,
      cardLink: '/panel/services/3'
    },
  ],
  [
    {
      customClass: 'info-block',
      cardColor: 'card-color-1',
      cardImg: '/images/1.svg',
      cardText: e.firstblock,
      cardLink: '/panel/services/4'
    },
    {
      cardColor: 'card-color-4',
      cardImg: '/images/4.svg',
      cardText: e.fourthblock,
      cardLink: '/panel/services/5'
    },
    {
      cardColor: 'card-color-5',
      cardImg: '/images/5.svg',
      cardText: e.fifthblock,
      cardLink: '/panel/services/6'
    },
    {
      cardColor: 'card-color-6',
      cardImg: '/images/6.svg',
      cardText: e.sixthblock,
      cardLink: '/panel/services/7'
    },
  ]
];

const BasePagePanel = props => {

  const [token, setToken] = React.useState(
    sessionStorage.getItem('tokenInfo')
  );
  const [lang, setLang] = React.useState(
    localStorage.getItem('lang') || 'ru'
  );

  React.useEffect(() => {
    props.breadCrumbs();
  }, []);

  React.useEffect(() => {
    e.setLanguage(lang)
  }, [lang]);

  return (
    <div className='container body-content'>
      <TokenAlert token={token} />
      <div className='container home-page col-md-12'>
        <div className='row'>
          <div className='col-md-12 col-xs-12 black-main text-center'>
            <h4>{e.public_services}</h4>
            <span><img src='/images/line.png' alt='' /></span>
            {cardBoxes.map((deck, index) => (
              <div className='card-deck' key={index}>
                {deck.map((data, index) => <CardBox key={index} {...data} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasePagePanel;