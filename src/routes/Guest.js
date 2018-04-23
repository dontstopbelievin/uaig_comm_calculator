import React from 'react';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WOW from 'wowjs';
import { UncontrolledCarousel, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let e = new LocalizedStrings({ru,kk});

export default class Guest extends React.Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      rolename: "",
      items: [
        {
          src: './images/slideshow/1.jpg',
          altText: '',
          caption: ''
        },
        {
          src: './images/slideshow/2.jpg',
          altText: '',
          caption: ''
        },
        {
          src: './images/slideshow/4.jpg',
          altText: '',
          caption: ''
        }
      ]
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
    new WOW.WOW({
        live: false
    }).init();
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
            
            <UncontrolledCarousel items={this.state.items} className="carousel-padding no-border" />

            <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
              <div className="row">
                <div className="col-md-12 col-xs-12 black-main text-center">
                  <h4 >ГОСУДАРСТВЕННЫЕ УСЛУГИ</h4>
                  <span><img src="images/line.png" /></span>
                    
                  <div className="card-deck wow fadeInUp" data-wow-duration="1.5s">   
                    <div className="card mt-4 mb-4 info-block"> 
                      <div className="card-image card-color-1">
                        <div className="image-border">
                          <img src="./images/1.svg" alt="true" />
                        </div>

                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Выдача справки по определению адреса объектов недвижимости
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>
                    </div>
                      
                    <div className="card  mt-4 mb-4 ">  
                      <div className="card-image card-color-2">
                        <div className="image-border">
                          <img src="./images/2.svg" alt="true" />
                        </div>
                      </div>
                          
                      <div className="card-body">
                        <p className="card-text">
                          Выдача архитектурно-планировочного задания
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/admin"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/citizen"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/urban"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/head"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/providerelectro"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/providergas"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/providerheat"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/providerwater"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>   
                    </div>
                      
                    <div className="card  mt-4 mb-4 ">
                      <div className="card-image card-color-3">
                        <div className="image-border">
                          <img src="./images/3.svg" alt="true" />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Выдача решения на фотоотчет
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>
                    </div>     
                  </div>
                    
                  <div className="card-deck wow fadeInUp" data-wow-duration="1.5s">
                    <div className="card mt-4 mb-4 ">
                      <div className="card-image card-color-4">
                        <div className="image-border">
                          <img src="./images/4.svg" alt="true" />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>
                    </div>
                      
                    <div className="card  mt-4 mb-4 ">
                      <div className="card-image card-color-5">
                        <div className="image-border">
                          <img src="./images/5.svg" alt="true" />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения)
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>
                    </div>
                      
                    <div className="card mt-4 mb-4 ">
                      <div className="card-image card-color-6">
                        <div className="image-border">
                          <img src="./images/6.svg" alt="true" />
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Предоставление земельного участка для строительства объекта в черте населенного пункта
                        </p>
                      </div>
                      <div>
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {!this.state.tokenExists && <AlertModal />}
                      </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
                
            <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
              <div className="row">
                <div className="col-md-12 col-xs-12 black-main text-center">
                  <h4 >НОВОСТИ</h4>
                  <span><img src="images/line.png" /></span>
                  
                  <div className="card-deck">
                    <div className="card  mt-4 mb-4 wow fadeInLeft" data-wow-duration="1.5s">
                      <div className="card-body">
                        <h5 className="text-muted card-text">Календарь новостей</h5>
                        <div className="month">
                          <ul className="weekdays">
                            <li>Пн</li>
                            <li>Вт</li>
                            <li>Ср</li>
                            <li>Чт</li>
                            <li>Пт</li>
                            <li>Сб</li>
                            <li>Вс</li>
                          </ul>
                          <div className="week"> 
                            <ul className="days">
                              <li><a className="text-muted" href="#">26</a></li>
                              <li><a className="text-muted" href="#">27</a></li>
                              <li><a className="text-muted" href="#">28</a></li>
                              <li><a href="#">1</a></li>
                              <li><a href="#">2</a></li>
                              <li className="weekend"><a href="#">3</a></li>
                              <li className="weekend"><a href="#">4</a></li>
                            </ul>
                            <ul className="days">
                              <li><a href="#">5</a></li>
                              <li><a href="#">6</a></li>
                              <li><a href="#">7</a></li>
                              <li><a href="#">8</a></li>
                              <li><a href="#">9</a></li>
                              <li className="weekend"><a href="#">10</a></li>
                              <li className="weekend"><a href="#">11</a></li>
                            </ul>
                            <ul className="days">
                              <li><a href="#">12</a></li>
                              <li><a href="#">13</a></li>
                              <li><a href="#">14</a></li>
                              <li><a className="active" href="#">15</a></li>
                              <li><a href="#">16</a></li>
                              <li className="weekend"><a href="#">17</a></li>
                              <li className="weekend"><a href="#">18</a></li>
                            </ul>
                            <ul className="days">
                              <li><a href="#">19</a></li>
                              <li><a href="#">20</a></li>
                              <li><a href="#">21</a></li>
                              <li><a href="#">22</a></li>
                              <li><a href="#">23</a></li>
                              <li className="weekend"><a href="#">24</a></li>
                              <li className="weekend"><a href="#">25</a></li>
                            </ul>
                            <ul className="days">
                              <li><a href="#">26</a></li>
                              <li><a href="#">27</a></li>
                              <li><a href="#">28</a></li>
                              <li><a href="#">29</a></li>
                              <li><a href="#">30</a></li>
                              <li className="weekend"><a href="#">31</a></li>
                              <li className="weekend"><a className="text-muted" href="#">1</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <input type="date" className="form-control calender no-bg" id="date" name="date" placeholder="Дата" required />
                      <a className="nav-link float-right" href="#">
                        <button className="btn btn-outline-warning my-2 my-sm-0" type="submit"><span className="font-weight-bold">Выбрать</span></button>
                      </a>
                    </div>
                      
                    <div className="card mt-4 mb-4 wow fadeInUp" data-wow-duration="1.5s">
                      <div className="list-group"> 
                        <div href="#" className="list-group-item flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="#"><small className="float-right text-warning view-more font-weight-bold">Подробнее</small></a>
                        </div>
                          
                        <div href="#" className="list-group-item  flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="#"><small className="float-right text-warning view-more font-weight-bold">Подробнее</small></a>
                        </div>
                      </div>
                    </div>
                      
                    <div className="card mt-4 mb-4 wow fadeInRight" data-wow-duration="1.5s">
                      <div className="list-group">
                          
                        <div href="#" className="list-group-item flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="#"><small className="float-right text-warning view-more font-weight-bold">Подробнее</small></a>
                        </div>
                          
                        <div href="#" className="list-group-item  flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="#"><small className="float-right text-warning view-more font-weight-bold">Подробнее</small></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                   
            <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
              <div className="row">
                <div className="col-md-12 col-xs-12 black-main text-center">
                  <h4>ВОПРОСЫ-ОТВЕТЫ</h4>
                  <span><img src="./images/line.png" /></span>
                  
                  <div className="card-deck comment">
                    <div className="card mt-4 mb-4">
                        <div className="card-body">
                            <div className="card-text">
                                <h6 className="text-muted">Уважаемый пользователь!</h6>
                                <p>Сервис «Вопрос – ответ» предназначен для подачи вопроса в режиме онлайн. Для этого Вам необходимо заполнить форму и определить категорию вопроса. Если Вы не знаете, к какой категории отнести вопрос, определите его в категории «Разное».</p>
                                <div className="dropdown-divider"></div>
                                <span><a className="text-warning font-weight-bold view-more" href="#">Смотреть все</a></span>
                            </div>
                        </div>
                    </div>  
                  </div>
                </div>
              </div>
            </div>   
                
            <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
              <div className="row">
                <div className="col-md-12 col-xs-12 black-main text-center">
                  <span><img className="col-md-12" src="./images/line-divider.png" /></span>
                  
                  <div className="card-deck">
                    <div className="slick-initialized slick-slider">
                      <div className="card-body col-md-12 strategy">
                        <a href="http://www.akorda.kz/kz" target="_blank"><img src="./images/strategy/akorda-kz.jpg" /></a>
                        <a href="http://www.akorda.kz/ru/addresses/addresses_of_president/poslanie-prezidenta-respubliki-kazahstan-nnazarbaeva-narodu-kazahstana-31-yanvarya-2017-g" target="_blank"><img src="./images/strategy/zholdau.jpg" /></a>
                        <a href="http://kyzmet.gov.kz/ru/kategorii/100-konkretnyh-shagov" target="_blank"><img src="./images/strategy/100shagov.jpg" /></a>
                        <a href="https://strategy2050.kz/" target="_blank"><img src="./images/strategy/kaz2050.png" /></a>
                        <a href="http://ruh.kz/" target="_blank"><img src="./images/strategy/ruhan_zhangyru.jpg" /></a>
                        <a href="http://www.akorda.kz/ru/events/akorda_news/press_conferences/statya-glavy-gosudarstva-vzglyad-v-budushchee-modernizaciya-obshchestvennogo-soznaniya" target="_blank"><img src="./images/strategy/modernization_ru.png" /></a>
                        <a href="https://almaty.gov.kz/page.php?page_id=3239&lang=1" target="_blank"><img src="./images/strategy/almaty2020.png" /></a>
                        <a href="http://egov.kz/cms/ru" target="_blank"><img src="./images/strategy/egov.png" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


// this Modal is for alert, if NCLayer is off
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
        <Button outline color="primary" onClick={this.toggle}>Подать заявку</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Информация</ModalHeader>
          <ModalBody>
            Вам надо &nbsp; 
            <NavLink to={"/login"} className="navLink" replace>
              войти
            </NavLink> в систему или  &nbsp;
            <NavLink to={"/register"} className="navLink" replace>
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