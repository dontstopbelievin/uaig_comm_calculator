import React from 'react';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/guest.json';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/guest.css";
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
      ru: true,
      kk: false,
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
                  <h4 >{e.news}</h4>
                  <span><img src="images/line.png" /></span>
                  
                  <div className="card-deck">
                    <div className="card  mt-4 mb-4 wow fadeInLeft" data-wow-duration="1.5s">
                      <div className="card-body">
                        <h5 className="calenderTitle text-muted card-text">{e.newscalendar}</h5>
                        <form>
                          <select className="month_name" >
                            <option>{e.january}</option>
                            <option>{e.february}</option>
                            <option selected>{e.march}</option>
                            <option>{e.april}</option>
                            <option>{e.may}</option>
                            <option>{e.june}</option>
                            <option>{e.jule}</option>
                            <option>{e.august}</option>
                            <option>{e.september}</option>
                            <option>{e.octember}</option>
                            <option>{e.november}</option>
                            <option>{e.december}</option>
                          </select>
                          <select className="year_name">
                            <option>2015</option>
                            <option>2016</option>
                            <option>2017</option>
                            <option selected>2018</option>                      
                          </select>
                        </form>
                                            
                        <div className="month">
                          <ul className="weekdays">
                            <li>{e.pn}</li>
                            <li>{e.vt}</li>
                            <li>{e.st}</li>
                            <li>{e.cht}</li>
                            <li>{e.pts}</li>
                            <li>{e.sub}</li>
                            <li>{e.vsk}</li>
                          </ul>
                          <div className="week">            
                            <table>
                              <tbody>
                                <tr className="days">
                                  <td className="col-md-1"><a href="#">26</a></td>
                                  <td className="col-md-1"><a href="#">27</a></td>
                                  <td className="col-md-1"><a href="#">28</a></td>
                                  <td className="col-md-1"><a href="#">1</a></td>
                                  <td className="col-md-1"><a href="#">2</a></td>
                                  <td className="weekend col-md-1">3</td>
                                  <td className="weekend col-md-1">4</td>
                                </tr>
                                <tr className="days">
                                  <td>5</td>
                                  <td>6</td>
                                  <td>7</td>
                                  <td>8</td>
                                  <td>9</td>
                                  <td className="weekend">10</td>
                                  <td className="weekend">11</td>
                                </tr>
                                <tr className="days">
                                  <td>12</td>
                                  <td>13</td>
                                  <td>14</td>
                                  <td>15</td>
                                  <td>16</td>
                                  <td className="weekend">17</td>
                                  <td className="weekend">18</td>
                                </tr>
                                <tr className="days">
                                  <td>19</td>
                                  <td>20</td>
                                  <td>21</td>
                                  <td>22</td>
                                  <td>23</td>
                                  <td className="weekend">24</td>
                                  <td className="weekend">25</td>
                                </tr>
                                <tr className="days">
                                  <td>26</td>
                                  <td>27</td>
                                  <td>28</td>
                                  <td>29</td>
                                  <td>30</td>
                                  <td className="weekend">31</td>
                                  <td className="weekend">1</td>
                                </tr>

                              </tbody>
                            </table>  
                          </div>
                            
                          </div>     
                        </div>
                    </div>
                      
                    <div className="card mt-4 mb-4 wow fadeInUp" data-wow-duration="1.5s">
                      <div className="list-group"> 
                        <div href="#" className="list-group-item flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="news-date text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="news-text text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">{e.moreinfo}</small></a>
                        </div>
                          
                        <div href="#" className="list-group-item  flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="news-date text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="news-text text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">{e.moreinfo}</small></a>
                        </div>
                      </div>
                    </div>
                      
                    <div className="card mt-4 mb-4 wow fadeInRight" data-wow-duration="1.5s">
                      <div className="list-group">
                          
                        <div href="#" className="list-group-item flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="news-date text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="news-text text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">{e.moreinfo}</small></a>
                        </div>
                          
                        <div href="#" className="list-group-item  flex-column align-items-start ">
                          <div className="d-flex w-100 left-content-between">
                              <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                              <p className="news-date text-muted font-weight-light">15.01.2018</p>
                          </div>
                            
                          <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                          <p className="news-text text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                          <div className="dropdown-divider"></div>
                          <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">{e.moreinfo}</small></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a className="allnews" aria-hidden="true" href="/#/NewsAll">
                      Все новости <span className="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
                  </a>
                </div>
              </div>
            </div>

            <div className="container home-page col-md-12 wow fadeInUp" data-wow-duration="1.5s">
              <div className="row">
                <div className="col-md-12 col-xs-12 black-main text-center">
                  <h4 >{e.public_services}</h4>
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
                            {e.firstblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
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
                            {e.secondblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && this.state.rolename === 'Admin' && <NavLink to={"/admin"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Citizen' && <NavLink to={"/citizen"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Region' &&  <NavLink to={"/urban"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Head' &&  <NavLink to={"/head"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Electricity' &&  <NavLink to={"/providerelectro"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Gas' &&  <NavLink to={"/providergas"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Heat' &&  <NavLink to={"/providerheat"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Water' &&  <NavLink to={"/providerwater"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'ApzDepartment' &&  <NavLink to={"/apz"} replace className="btn btn-primary">Подать заявку</NavLink>}
                        {this.state.tokenExists && this.state.rolename === 'Engineer' &&  <NavLink to={"/engineer"} replace className="btn btn-primary">Подать заявку</NavLink>}
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
                            {e.thirdblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
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
                            {e.fourthblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
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
                            {e.fifthblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
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
                            {e.sixthblock}
                        </p>
                      </div>
                      <div className="card-button">
                        {/*<button className="btn btn-danger bg-danger text-white font-weight-bold">Подать заявку</button>*/}
                        {this.state.tokenExists && <NavLink to={"/"} replace className="btn btn-primary">{e.apply}</NavLink>}
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
                  <h4>{e.questionsanswers}</h4>
                  <span><img src="./images/line.png" /></span>
                  
                  <div className="card-deck comment">
                    <div className="card mt-4 mb-4">
                        <div className="card-body">
                            <div className="card-text">
                                <h6 className="dearUser text-muted">{e.dearuser}</h6>
                                <p>{e.messageforuser}</p>
                                <div className="dropdown-divider"></div>
                                <span><a className="text-warning font-weight-bold view-more" href="#">{e.viewall}</a></span>
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
                        {localStorage.getItem('lang') === 'ru' && <a href="https://www.almaty.gov.kz/page.php?page_id=3447&lang=1&article_id=39871" target="_blank"><img src="/images/strategy/prom_revolution_4_ru.jpg" /></a>}
                        {localStorage.getItem('lang') === 'kk' && <a href="https://www.almaty.gov.kz/page.php?page_id=3498&lang=3" target="_blank"><img src="/images/strategy/prom_revolution_4_kz.jpg" /></a>}  
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
        <Button className="btn btn-danger bg-danger text-white font-weight-bold" style={{textTransform:'none'}} onClick={this.toggle}>{e.apply}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{e.info}</ModalHeader>
          <ModalBody>
              {e.youneed} &nbsp;
            <NavLink to={"/login"} className="navLink" replace>
                {e.login}
            </NavLink> {e.or}  &nbsp;
            <NavLink to={"/register"} className="navLink" replace>
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