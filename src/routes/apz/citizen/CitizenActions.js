import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../../languages/header.json';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

let e = new LocalizedStrings({ru,kk});


export default class CitizenActions extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        welcome_text: true,
        left_tabs: true,
        active: false
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
    toggle(){
      this.setState({active: true})
    }



  render() {
    return (

      <div className="content container body-content citizen-apz-list-page">
        <div>
          <div className="left-tabs">
            {this.state.left_tabs &&
              <div className="buttons">
                  <Link to="/panel/citizen/apz"><button onClick="toggle()" className={this.state.active === false ? 'isactive1' : 'tab1'}>Выдача архитектурно-планировочного задания</button></Link>
                  <Link to="/panel/citizen/sketch"><button className="tab2">Выдача решения на эскизный проект</button></Link>
                  <Link to="/panel/citizen/photoreports"><button className="tab3">Выдача решения на фотоотчет</button></Link>
                  <Link to="/"><button className="tab4">Выдача справки по определению адреса объектов недвижимости</button></Link>
                  <Link to="/"><button className="tab5">Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения</button></Link>
                  <Link to="/"><button className="tab6">Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)</button></Link>
                  <Link to="/"><button className="tab7">Предоставление земельного участка для строительства объекта в черте населенного пункта</button></Link>
              </div>
            }
          </div>

          <div className="right-side">
            {this.state.welcome_text &&
              <div class="apzinfo">
                <div class = "time">
                   <p><center><strong>ПАМЯТКА</strong></center></p>
                   <p><strong><u>Архитектурно-планировочное задание</u></strong> - комплекс требований к назначению, основным параметрам и размещению объекта на конкретном земельном участке (площадке, трассе), а также обязательные требования, условия и ограничения к проектированию и строительству, устанавливаемые в соответствии с градостроительными регламентами для данного населенного пункта. При этом допускается установление требований по цветовому решению и использованию материалов отделки фасадов зданий (сооружений), объемно-пространственному решению в соответствии с эскизами (эскизными проектами), предоставляемыми заказчиком (застройщиком, инвестором).
                   </p>
                </div>
                <div>
                <Accordion>
                  <AccordionItem>
                      <AccordionItemTitle className="accordion__title accordion__title--animated">
                          <h3 className="u-position-relative">
                              ПАКЕТ 1
                              <div className="accordion__arrow" role="presentation" />
                          </h3>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                            <p>СРОК ОКАЗАНИЯ – 15 РАБОЧИХ ДНЕЙ</p>
                            <p><strong>Перечень документов, необходимых для оказания государственной услуги на РЕКОНСТРУКЦИЮ, СТРОИТЕЛЬСТВО ПРИСТРОЙКИ, НАДСТРОЙКИ, ПЕРЕПЛАНИРОВКА, ПЕРЕОБОРУДОВАНИЕ:</strong></p>
                            <ul>
                              <li>1)  заявление по форме, согласно приложению 4 к настоящему стандарту государственной услуги;</li>
                              <li>2)	документ, удостоверяющий личность (для идентификации личности услугополучателя);</li>
                              <li>3)	утвержденное задание на проектирование;</li>
                              <li>4)	документ, удостоверяющий право собственности заявителя на изменяемый объект, с представлением подлинников для сверки государственным органом, рассматривающим заявление, подлинности документов, либо его нотариально засвидетельствованная копия;</li>
                              <li>5)	письменное согласие собственника (сособственников) объекта на намечаемое изменение и его параметры;</li>
                              <li>6)	нотариальное засвидетельствованное письменное согласие собственников других помещений (частей дома), смежных с изменяемыми помещениями (частями дома), в случае, если планируемые реконструкции (перепланировки, переоборудование) помещений (частей жилого дома) или перенос границ помещений затрагивают их интересы;</li>
                              <li>7)	технический паспорт изменяемого помещения (оригинал предоставляется для сверки);</li>
                              <li>8)	технический проект (сейсмозаключение);</li>
                              <li>9)	опросный лист для технических условий на подключение к источникам инженерного и коммунального обеспечения по форме, согласно приложению 3 к настоящему стандарту государственной услуги и топографическая съемка (при необходимости в дополнительном подключении к источникам инженерного и коммунального обеспечения и/или увеличении нагрузок)</li>
                              <li>10)	правоустанавливающий документ на земельный участок (если реконструкция предусматривает дополнительный отвод (прирезку) земельного участка) (оригинал предоставляется для сверки).</li>
                            </ul>
                      </AccordionItemBody>
                  </AccordionItem>
                  <AccordionItem className="accordion__item">
                      <AccordionItemTitle className="accordion__title accordion__title--animated">
                          <h3 className="u-position-relative">
                              ПАКЕТ 2
                              <div className="accordion__arrow" role="presentation" />
                          </h3>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                          <p>СРОК ОКАЗАНИЯ – 15 РАБОЧИХ ДНЕЙ</p>
                          <p><strong>Перечень документов, необходимых для оказания государственной услуги предоставление исходных материалов на новое строительство:</strong></p>
                          <ul>
                            <li>1)	заявление по форме, согласно приложению 2 к настоящему стандарту государственной услуги (в заявлении указывается «пакет 2», срок оказания государственной услуги - 15 рабочих дней); </li>
                            <li>2)	документ, удостоверяющий личность (для идентификации личности услугополучателя);</li>
                            <li>3)	утвержденное задание на проектирование;</li>
                            <li>4)	правоустанавливающий документ на земельный участок;</li>
                            <li>5)	опросный лист для технических условий на подключение к источникам инженерного и коммунального обеспечения по форме, согласно приложению 3 к настоящему стандарту государственной услуги;</li>
                            <li>6)	топографическая съемка (срок действия которой не должен превышать одного года)</li>
                          </ul>
                      </AccordionItemBody>
                  </AccordionItem>
              </Accordion>
                </div>
                <button class="btn btn-raised btn-success" onClick={this.hide_text.bind(this)}>Перейти к заявкам</button>
              </div>
            }
          </div>

          <div className="card-body">

          </div>


        </div>
      </div>
    )
  }
}
