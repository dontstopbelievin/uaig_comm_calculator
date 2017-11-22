import React from 'react';

export default class Guest extends React.Component {

  componentWillMount() {
    //console.log("GuestComponent will mount");
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
  }

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    //console.log("rendering the GuestComponent");
    return (
      <div>
        <div className="slide">
          <h1>УПРАВЛЕНИЕ АРХИТЕКТУРЫ И ГРАДОСТРОИТЕЛЬСТВА ГОРОДА АЛМАТЫ</h1>
          <h2>Официальный сайт</h2>
        </div>

        <div className="row block-title">
          <div className="col-12">
            <h2>Государственные услуги</h2>
          </div>
        </div>

        <div className="row promo-block">
          <div className="col-6 promo1">
            <h3>Регистрация участка</h3>
            <a className="btn btn-outline-secondary" >Подать заявку</a>
          </div>
          <div className="col-6 promo2">
            <h3>Статус заявления</h3>
            <a className="btn btn-outline-secondary" >Проверить</a>
          </div>
          <div className="col-6 promo3">
            <h3>Вопрос руководству</h3>
            <a className="btn btn-outline-secondary" >Задать вопрос</a>
          </div>
          <div className="col-6 promo4">
            <h3>Нормативные акты</h3>
            <a className="btn btn-outline-secondary" >Подробнее</a>
          </div>
        
        </div>
        <div className="container">
          <div className="row block-title">
            <div className="col-12">
              <h2>{/* title */}</h2>
            </div>
          </div>
          <div className="block-content">
            {/* text */}
          </div>
        </div>  
      </div>

      
    )
  }
}