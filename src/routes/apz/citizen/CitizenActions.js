import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../../languages/guest.json';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { NavLink } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let e = new LocalizedStrings({ru,kk});


export default class CitizenActions extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        welcome_texts: [false, false],
        left_tabs: true,
        tokenExists: false,
        active: false
      };
    }

    componentWillMount(){
      var index = this.props.match.params.index;
      var welcome_texts = [false, false];
      welcome_texts[index-1] = true;
      this.setState({welcome_texts: welcome_texts});
      if(sessionStorage.getItem('tokenInfo')){
        this.setState({ tokenExists: true });
        var roleName = JSON.parse(sessionStorage.getItem('userRoles'))[0];
        if(roleName === 'Urban' || roleName === 'Provider'){
          roleName = JSON.parse(sessionStorage.getItem('userRoles'))[1];
          this.setState({ rolename: roleName });
        }
        else{
          this.setState({ rolename: roleName });
        }
      }
    }

    componentWillReceiveProps(nextProps){
      var index = nextProps.match.params.index;
      var welcome_texts = [false, false];
      welcome_texts[index-1] = true;
      this.setState({welcome_texts: welcome_texts});
    }

  render() {
    var index = this.props.match.params.index;
    return (

      <div className="content container body-content citizen-apz-list-page">
        <div>
          <div className="left-tabs">
            {this.state.left_tabs &&
              <div className="buttons">
                  <NavLink activeClassName="isactive" className="tab1" isActive={(match, location) => index === '1'} exact to="/panel/services/1" replace>Выдача архитектурно-планировочного задания</NavLink>
                  <NavLink activeClassName="isactive" className="tab2" isActive={(match, location) => index === '2'} exact to="/panel/services/2" replace>Выдача решения на эскизный проект</NavLink>
                  <NavLink activeClassName="isactive" className="tab3" isActive={(match, location) => index === '3'} exact to="/panel/services/3" replace>Выдача решения на фотоотчет</NavLink>
                  <NavLink activeClassName="isactive" className="tab4" isActive={(match, location) => index === '4'} exact to="/panel/services/4" replace>Выдача справки по определению адреса объектов недвижимости</NavLink>
                  <NavLink activeClassName="isactive" className="tab5" isActive={(match, location) => index === '5'} exact to="/panel/services/5" replace>Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения</NavLink>
                  <NavLink activeClassName="isactive" className="tab6" isActive={(match, location) => index === '6'} exact to="/panel/services/6" replace>Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)</NavLink>
                  <NavLink activeClassName="isactive" className="tab7" isActive={(match, location) => index === '7'} exact to="/panel/services/7" replace>Предоставление земельного участка для строительства объекта в черте населенного пункта</NavLink>
              </div>
            }
          </div>

          <div className="right-side">
            {this.state.welcome_texts[0] &&
              <div className="apzinfo">
                <div className = "time">
                   <p><strong>Архитектурно-планировочное задание</strong> - комплекс требований к назначению, основным параметрам и размещению объекта на конкретном земельном участке (площадке, трассе), а также обязательные требования, условия и ограничения к проектированию и строительству, устанавливаемые в соответствии с градостроительными регламентами для данного населенного пункта. При этом допускается установление требований по цветовому решению и использованию материалов отделки фасадов зданий (сооружений), объемно-пространственному решению в соответствии с эскизами (эскизными проектами), предоставляемыми заказчиком (застройщиком, инвестором).
                   </p>
                </div>
                <div className="packages">
                <Accordion>
                  <AccordionItem>
                      <AccordionItemTitle className="accordion__title accordion__title--animated">
                          <h6 className="u-position-relative">
                              Пакет 1
                              <div className="accordion__arrow" role="presentation" />
                          </h6>
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
                          <h6 className="u-position-relative">
                              Пакет 2
                              <div className="accordion__arrow" role="presentation" />
                          </h6>
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
                <div className="apzinfo-bottom">
                    <div className="card-button">{console.log(this.state.rolename)}
                      {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                      {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/panel/admin/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/panel/citizen/apz/status/active/1"} replace className="btn btn-primary">Подать заявку</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/apz/status/ractive/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/panel/head/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/panel/elector-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/panel/gas-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/panel/heat-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/panel/water-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Phone' &&  <NavLink to={"/panel/phone-provider/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'StateServices' &&  <NavLink to={"/panel/state_services/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/panel/engineer/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Office' &&  <NavLink to={"/panel/office/apz/all/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Lawyer' &&  <NavLink to={"/panel/lawyer/apz/status/new/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'GeneralPlan' &&  <NavLink to={"/panel/gen_plan/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'HeadsStateServices' &&  <NavLink to={"/panel/head_state_services/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {!this.state.tokenExists && <AlertModal />}
                    </div>
                </div>
              </div>
            }
            {this.state.welcome_texts[1] &&
              <div class="apzinfo">
                <div class = "time">
                   <p><strong>Эскизный проект</strong> – это набор документов, схем и чертежей, который содержит данные о разрабатываемом объекте, его назначении, основные технические, архитектурные и конструктивные параметры. Это упрощенный вид проектного решения, объясняющий его замысел и позволяющий составить представление о дальнейших работах.</p>
                </div>
                <div class="packages">
                   <p><strong>Срок рассмотрения заявления:</strong></p>
                   <li>1.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически несложных объектов – 10 (десять) рабочих дней.</li>
                   <li>2.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) технически и (или) технологически сложных объектов – 15 (пятнадцать) рабочих дней.</li>
                   <li>3.	Срок рассмотрения заявления и согласования эскиза (эскизного проекта) при изменении внешнего облика (фасадов) существующего объекта – 15 (пятнадцать) рабочих дней.</li>
                   <div>Мотивированный отказ – 5 (пять) рабочих дней</div>
                   <br></br>
                   <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                   <li>1.	заявление о предоставлении государственной услуги (заполняется онлайн);</li>
                   <li>2.	электронная копия документа удостоверяющего личность;</li>
                   <li>3.	электронная копия эскиза (эскизный проект);</li>
                   <li>4.	копия архитектурно-планировочного задания;</li>
                </div>
                <div className="apzinfo-bottom">
                  <div className="card-button">
                      {/*this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/panel"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/panel/citizen/sketch"} replace className="btn btn-primary">Подать заявку</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/panel/head/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/panel/engineer/sketch"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {!this.state.tokenExists && <AlertModal />}
                  </div>
                </div>
              </div>
            }
            {this.state.welcome_texts[2] &&
              <div className="apzinfo">
                <div className="time">
                  <h4>РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ</h4>
                  <p>Попробуйте зайти позже</p>
                </div>
              </div>
            }
            {this.state.welcome_texts[3] &&
              <div className="apzinfo">
                <div className="time">
                  <h4>РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ</h4>
                  <p>Попробуйте зайти позже</p>
                </div>
              </div>
            }
            {this.state.welcome_texts[4] &&
              <div className="apzinfo">
                <div className="time">
                  <h4>РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ</h4>
                  <p>Попробуйте зайти позже</p>
                </div>
              </div>
            }
            {this.state.welcome_texts[5] &&
              <div className="apzinfo">
                <div className="time">
                  <h4>РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ</h4>
                  <p>Попробуйте зайти позже</p>
                </div>
              </div>
            }
            {this.state.welcome_texts[6] &&
              <div className="apzinfo">
                <div className="time">
                  <h4>РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ</h4>
                  <p>Попробуйте зайти позже</p>
                </div>
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


class AlertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Button className="btn btn-danger bg-danger text-white font-weight-bold" style={{textTransform:'none'}} onClick={this.toggle}>{e.apply}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{e.info}</ModalHeader>
          <ModalBody>
            {e.youneed} &nbsp;
            <NavLink to={"/panel/common/login"} className="navLink" replace>
              {e.login}
            </NavLink> {e.or}  &nbsp;
            <NavLink to={"/panel/common/register"} className="navLink" replace>
              {e.logup}
            </NavLink> {e.needkz}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>{e.close}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
