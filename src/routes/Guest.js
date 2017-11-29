import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';

let e = new LocalizedStrings({ru,kk});

export default class Guest extends React.Component {
  constructor() {
    super();

    e.setLanguage(localStorage.getItem('lang'));
  }

  componentWillMount() {
    //console.log("GuestComponent will mount");
    // strings.setLanguage('kk');
    // e.setLanguage(this.props.lang);
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
    
  }

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    return (
      <div>
        {/*<div className="slide">
          <h1>УПРАВЛЕНИЕ АРХИТЕКТУРЫ И ГРАДОСТРОИТЕЛЬСТВА ГОРОДА АЛМАТЫ</h1>
          <h2>Официальный сайт</h2>
        </div>*/}

        <div className="container">
          <div className="row">
            <div className="col-9 jumbotron block-main">
              <h2>{e.publicServices}</h2>
              <div className="block-content">
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Выдача справки по определению адреса объектов недвижимости</button>
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Выдача архитектурно-планировочного задания</button>
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Выдача решения на реконструкцию (перепланировку, переоборудование)</button>
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Выдача решения о строительстве культовых зданий, определении их месторасположения</button>
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Выдача решения о перепрофилировании зданий в культовые здания</button>
                <button type="button" class="btn btn-outline-secondary btn-block" style={{textAlign: 'left'}}>Предоставление земельного участка для строительства объекта в черте населенного пункта</button>
              </div>
              <div className="row promo-block">
                <div className="col-6 promo1">
                  <h5>Выдача справки по определению адреса объектов недвижимости</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
                <div className="col-6 promo2">
                  <h5>Выдача архитектурно-планировочного задания</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
                <div className="col-6 promo3">
                  <h5>Выдача решения на реконструкцию (перепланировку, переоборудование)</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
                <div className="col-6 promo4">
                  <h5>Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
                <div className="col-6 promo1">
                  <h5>Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
                <div className="col-6 promo2">
                  <h5>Предоставление земельного участка для строительства объекта в черте населенного пункта</h5>
                  <a className="btn btn-outline-secondary" >Подать заявку</a>
                </div>
              </div>
            </div>

            <div className="col-3 block-main">
              <center><h3>Новости</h3></center>

            </div> 

          </div>  
        </div>

      </div>


      
    )
  }
}