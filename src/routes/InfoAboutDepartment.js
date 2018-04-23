import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import Slider from 'react-slick';
import LocalizedStrings from 'react-localization';
import "../assets/css/InfoAboutDepartment.css";
import {ru, kk} from '../languages/guest.json';
import { NavLink, UncontrolledCarousel, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let e = new LocalizedStrings({ru,kk});

export default class Guest extends React.Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      rolename: ""
    }
  }




  gotoLogin() {
    this.props.history.replace('/login');
  }

  componentWillMount() {
    //console.log("GuestComponent will mount");
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
    
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

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    var roles = JSON.parse(sessionStorage.getItem('userRoles'));

    return (
      <div className="section">
        <div className="container">
          <div className="row body" style={{paddingRight: '15px'}}> 
            <div className="body-box">
                    <h3 className="title col-md-12">Об Управлении Архитектуры и Градостройтельства г.Алматы</h3>
                    <div className="DepartmentBoss col-md-12">
                        <div className="picBoss col-md-4"></div>
                        <div className="infoBoss col-md-7"></div>
                    </div>
                    
                    <div className="col-md-12">
                    
                        <h5 className="title-2 col-md-12">Основные направления</h5>
                        <div className="text col-md-11">
                        <p>1. Отдел экономики и финансов (далее - «Отдел») является структурным подразделением Управления культуры города Алматы.<br/>
                        В своей деятельности Отдел руководствуется Конституцией, законами Республики Казахстан, актами Президента Республики Казахстан и Правительства страны, решениями, распоряжениями акима города Алматы, постановлениями акимата города Алматы, настоящим Положением и инструкциями, установленными акиматом города.<br/><br/>

                        2. Определяет статус, полномочия и организационную деятельность отдела экономики и финансов.<br/><br/>

                        3. Отдел строит свою работу в соответствии с планом работы управления, поручениями руководства управления и вышестоящих органов.<br/>
                        </p>
                        </div>
                    </div>
                    <div className="col-md-12">
                    
                        <h5 className="title-2 col-md-12">Задачи и функции:</h5>
                        <div className="text col-md-11">
                            <li>формирование и разработка единой стратегии и согласованных действий управления по финансовым и экономическим вопросам;</li>
                            <li>координация и контроль за работой бухгалтерского учета подведомственных учреждений, предприятий;
                            осуществление практических мер по совершенствованию деятельности в финансовых и экономических вопросах;
                            проведение анализа работы по ведению бухгалтерского учета;
                                осуществление предварительного контроля за своевременным и правильным оформлением документов и законностью совершаемых операций;</li>
                            <li>контроль за правильным и эффективным расходованием средств в соответствии с открытыми лимитами и их целевым назначением по утвержденным сметам расходов по бюджету с учетом внесенных в установленном порядке изменений, а также за сохранностью денежных средств и материальных ценностей;
                            своевременное доведение открытых лимитов бюджетным организациям, ведущих учет самостоятельно, а также контроль за исполнением ими смет расходов и правильным ведением бухгалтерского учета;
                            начисление и выплата в срок заработной платы служащим управления;
                                своевременное проведение расчетов, возникающих в процессе исполнения смет с организациями и отдельными лицами;</li>
                            <li>участие в проведении инвентаризации денежных средств, расчетов и материальных ценностей, своевременное и правильное определение результатов инвентаризации и отражение их в учете;
                                проведение инструктажа материально-ответственных лиц по вопросам учета и сохранности ценностей, находящихся на их ответственном хранении;</li>
                            <li>компьютеризация учетно-вычислительных работ;
                            составление и представление в установленные сроки бухгалтерской отчетности;
                            составление и согласование с руководителем управления смет расходов и расчетов к ним;
                            осуществление контроля за сохранностью активов, малоценных и быстроизнашивающихся предметов и других материальных ценностей в местах их хранения и эксплуатации;
                                систематизированный учет положений, инструкций, методических указаний по вопросам учета и отчетности, других нормативных документов, относящихся к компетенции отдела.</li>
                        </div>
                    </div>
                </div>

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
        <Button className="btn btn-danger bg-danger text-white font-weight-bold" style={{textTransform:'none'}} onClick={this.toggle}>Подать заявку</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Информация</ModalHeader>
          <ModalBody>
            Вам надо 
            <NavLink to={"/login"} tag={RRNavLink} className="navLink" replace>
              войти
            </NavLink> в систему или 
            <NavLink to={"/register"} tag={RRNavLink} className="navLink" replace>
              зарегистрироваться
            </NavLink>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Закрыть</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}