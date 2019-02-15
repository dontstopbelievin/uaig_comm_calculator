import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../../languages/header.json';

let e = new LocalizedStrings({ru,kk});

export default class CitizenActions extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        welcome_text: true,
        left_tabs: true
      };
    }
    componentWillMount(){
      if(this.props.history.location.pathname != "/panel/citizen/apz"){
        this.setState({welcome_text:false, left_tabs:false});
      }
    }

    hide_text(){
      this.setState({welcome_text:false, left_tabs:false});
      this.props.history.push("/panel/citizen/apz/status/active/1");
    }

  render() {
    return (

      <div className="content container body-content citizen-apz-list-page">
        <div>
          <div class="left-tabs">
            {this.state.left_tabs &&
              <ul>
                 <li>
                   <Link to="/panel/citizen/apz">Выдача архитектурно-планировочного задания</Link>
                 </li>
                 <li>
                   <Link to="/panel/citizen/sketch">Выдача решения на эскизный проект</Link>
                 </li>
                 <li>
                   <Link to="/panel/citizen/photoreports">Выдача решения на фотоотчет</Link>
                 </li>
               </ul>
            }
          </div>
          <div className="card-body">
            {this.state.welcome_text &&
              <div class="apzinfo">
                <div class = "time">
                   <p>Срок рассмотрения заявления:</p>
                   <li>на выдачу архитектурно-планировочного задания и технических условий – 6 (шесть) рабочих дней;</li>
                   <li>Мотивированный отказ – 5 (пять) рабочих дней.</li>
                </div>
                <div class="application">
                   <p>Необходимый перечень документов для получения АПЗ и ТУ:</p>
                   <li>заявление о предоставлении АПЗ и ТУ по форме (заполняется онлайн);</li>
                   <li>электронная копия правоустанавливающего документа на земельный участок;</li>
                   <li>электронная копия задания на проектирование;</li>
                   <li>опросный лист для ТУ на подключение к источникам инженерного и коммунального обеспечения по форме (заполняется онлайн);</li>
                </div>
                <button class="btn btn-raised btn-success" onClick={this.hide_text.bind(this)}>Перейти к заявкам</button>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
