import React from 'react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import {service1,service2,service3,service4,service5,service6,service7} from '../languages/services.json';
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

    componentDidMount(){
      this.props.breadCrumbs();
    }

    componentWillReceiveProps(nextProps){
      var index = nextProps.match.params.index;
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

    InProcess(){
      alert("Данный раздел находится в разработке.");
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
                   <p><strong>{service1.name}</strong> - {service1.description}</p>
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
                              <p>{service1.period[0]}</p>
                              <p><strong>Перечень документов, необходимых для оказания государственной услуги на РЕКОНСТРУКЦИЮ, СТРОИТЕЛЬСТВО ПРИСТРОЙКИ, НАДСТРОЙКИ, ПЕРЕПЛАНИРОВКА, ПЕРЕОБОРУДОВАНИЕ:</strong></p>
                              <ul>
                                {service1.list_of_documents[0].split(';').map(function(item, index) {
                                    return(
                                      <li key={index}>{index+1}) {item};</li>
                                    )
                                })}
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
                            <p>{service1.period[1]}</p>
                            <p><strong>Перечень документов, необходимых для оказания государственной услуги предоставление исходных материалов на новое строительство:</strong></p>
                            <ul>
                            {service1.list_of_documents[1].split(';').map(function(item, index) {
                                return(
                                  <li key={index}>{index+1}) {item};</li>
                                )
                            })}
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
                      {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
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
                      {this.state.tokenExists && this.state.rolename === 'GeneralPlan' &&  <NavLink to={"/panel/gen_plan/apz/status/state_active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'GeneralPlanHead' &&  <NavLink to={"/panel/gen_plan_head/apz/status/state_active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'GeneralPlanScheme' &&  <NavLink to={"/panel/gen_plan_scheme/apz/status/state_active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'GeneralPlanCalculation' &&  <NavLink to={"/panel/gen_plan_calculation/apz/status/state_active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'HeadsStateServices' &&  <NavLink to={"/panel/head_state_services/apz/status/active/1"} replace className="btn btn-primary">Заявки на АПЗ</NavLink>}
                      {!this.state.tokenExists && <AlertModal />}
                      <div className="reglament">
                        <a href="http://adilet.zan.kz/rus/docs/V12PG003299">Регламент Гос. услуги</a>
                        <a href="http://adilet.zan.kz/rus/docs/V1500011018">Стандарт Гос. услуги</a>
                      </div>
                    </div>
                  </div>
              </div>
            }
            {this.state.welcome_texts[1] &&
              <div className="apzinfo">
                <div class = "time">
                   <p><strong>{service2.name}</strong> – {service2.description}</p>
                </div>
                <div className="packages">
                   <p><strong>Срок рассмотрения заявления:</strong></p>
                   {service2.period[0].split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                   <div>{service2.period[1]}</div>
                   <br></br>
                   <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                   {service2.list_of_documents.split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                </div>
                <div className="apzinfo-bottom">
                  <div className="card-button">
                      {/*this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/panel"} replace className="btn btn-primary">Эскизные проекты</NavLink>*/}
                      {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/panel/citizen/sketch/status/active/1"} replace className="btn btn-primary">Подать заявку</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/panel/urban/sketch/status/active/1"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/panel/head/sketch/status/active/1"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/panel/engineer/sketch/status/active/1"} replace className="btn btn-primary">Эскизные проекты</NavLink>}
                      {!this.state.tokenExists && <AlertModal />}
                      <div className="reglament">
                        <a href="http://adilet.zan.kz/rus/docs/V16Z0004461">Регламент Гос. услуги</a>
                        <a href="http://adilet.zan.kz/rus/docs/V1600013610">Стандарт Гос. услуги</a>
                      </div>
                  </div>
                </div>
              </div>
            }
            {this.state.welcome_texts[2] &&
              <div className="apzinfo1">
                <div className="time1">
                  <h4>{service3.name}</h4>
                  <p>{service3.description}</p>
                </div>
              </div>
            }
            {this.state.welcome_texts[3] &&
              <div className="apzinfo">
                <div className = "time">
                   <p>Результат оказания услуг:</p>
                   {service4.description.split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                   <br></br>
                   {service4.period.split(';').map(function(item, index) {
                       return(
                         <p>{item};</p>
                       )
                   })}
                </div>
                <div className="packages">
                  <Accordion>
                    <AccordionItem>
                        <AccordionItemTitle className="accordion__title accordion__title--animated">
                            <h6 className="u-position-relative">
                                Выдача справки по уточнению адреса объектов недвижимости без истории:
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                              <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                              <ul>
                                {service4.list_of_documents[0].split(';').map(function(item, index) {
                                    return(
                                      <li>{index+1}) {item};</li>
                                    )
                                })}
                              </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem className="accordion__item">
                        <AccordionItemTitle className="accordion__title accordion__title--animated">
                            <h6 className="u-position-relative">
                                Выдача справки по уточнению адреса объектов недвижимости с историей (при отсутствии архивных сведений об изменении адреса объекта недвижимости в информационной системе "Адресный регистр"):
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                            <ul>
                            {service4.list_of_documents[1].split(';').map(function(item, index) {
                                return(
                                  <li>{index+1}) {item};</li>
                                )
                            })}
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem className="accordion__item">
                        <AccordionItemTitle className="accordion__title accordion__title--animated">
                            <h6 className="u-position-relative">
                                Выдача справки об упразднении адреса объекта недвижимости, с выездом на место нахождения объекта недвижимости и с обязательной регистрацией его в информационной системе "Адресный регистр" с указанием регистрационного кода адреса:
                                <div className="accordion__arrow" role="presentation" />
                            </h6>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                            <ul>
                            {service4.list_of_documents[1].split(';').map(function(item, index) {
                                return(
                                  <li>{index+1}) {item};</li>
                                )
                            })}
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                </Accordion>
               </div>
               <div className="apzinfo-bottom">
                    <div className="card-button">
                      <button type="button" onClick={this.InProcess} className="btn btn-secondary">Перейти к заявке</button>
                      <div className="reglament">
                        <a href="http://adilet.zan.kz/rus/docs/V13K0002400">Регламент Гос. услуги</a>
                        <a href="http://adilet.zan.kz/rus/docs/V1500011018">Стандарт Гос. услуги</a>
                      </div>
                    </div>
                  </div>
              </div>
            }
            {this.state.welcome_texts[4] &&
              <div className="apzinfo">
                <div class = "time">
                   <p>{service5.description}</p>
                </div>
                <div className="packages">
                   <p><strong>Срок рассмотрения заявления:</strong></p>
                   <li>{service5.period}</li>
                   <br></br>
                   <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                   {service5.list_of_documents[0].split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                </div>
                <div className="apzinfo-bottom">
                    <div className="card-button">
                      <button type="button" onClick={this.InProcess} className="btn btn-secondary">Перейти к заявке</button>
                      <div className="reglament">
                        <a href="http://adilet.zan.kz/rus/docs/V14S0002879">Регламент Гос. услуги</a>
                        <a href="http://adilet.zan.kz/rus/docs/V1500011183">Стандарт Гос. услуги</a>
                      </div>
                    </div>
                </div>
              </div>
            }
            {this.state.welcome_texts[5] &&
              <div className="apzinfo">
                <div class = "time">
                   <p>{service6.description}</p>
                </div>
                <div className="packages">
                   <p><strong>Срок рассмотрения заявления:</strong></p>
                   <li>{service6.period}</li>
                   <br></br>
                   <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                   {service6.list_of_documents[0].split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                </div>
                <div className="apzinfo-bottom">
                    <div className="card-button">
                      <button type="button" onClick={this.InProcess} className="btn btn-secondary">Перейти к заявке</button>
                      <div className="reglament">
                        <a href="">Регламент Гос. услуги</a>
                        <a href="">Стандарт Гос. услуги</a>
                      </div>
                    </div>
                </div>
              </div>
            }
            {this.state.welcome_texts[6] &&
              <div className="apzinfo">
                <div class = "time">
                   <p>{service7.description}</p>
                </div>
                <div className="packages">
                    <p><strong>Срок рассмотрения заявления:</strong></p>
                    <p>1-этап: <i>{service7.period[0]}</i></p>
                    <p>2-этап: <i>{service7.period[1]}</i></p>
                    <p>{service7.period[2]}</p>
                   <br></br>
                   <p><strong>Необходимый перечень документов для получения услуги:</strong></p>
                   <p>1 - этап:</p>
                   {service7.list_of_documents[0].split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                   <br></br>
                   <p>2 - этап:</p>
                   {service7.list_of_documents[1].split(';').map(function(item, index) {
                       return(
                         <li>{index+1}) {item};</li>
                       )
                   })}
                </div>
                <div className="apzinfo-bottom">
                    <div className="card-button">
                      <button type="button" onClick={this.InProcess} className="btn btn-secondary">Перейти к заявке</button>
                      <div className="reglament">
                        <a href="http://adilet.zan.kz/rus/docs/V15P0004512">Регламент Гос. услуги</a>
                        <a href="http://adilet.zan.kz/rus/docs/V1500011051">Стандарт Гос. услуги</a>
                      </div>
                    </div>
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
