import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {ru, kk} from '../languages/header.json';
import LocalizedStrings from 'react-localization';
//import '../assets/css/navbar.css';
import Loader from 'react-loader-spinner';
let e = new LocalizedStrings({ru,kk});

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
      (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');
    this.state = {
      categories: [],
      menuItems: [],
      loaderHidden: false
    };
    this.giveActiveClass = this.giveActiveClass.bind(this);
  }
  componentDidMount () {
    if ( !this.props.panelTrue )
    {
      this.getCategories();
      this.getMenuItem();
    }
  }
  componentWillReceiveProps(nextProps) {
    if ( !this.props.panelTrue )
    {
      this.getCategories();
      this.getMenuItem();
    }
  }
  giveActiveClass(path) {
    if(path === this.props.pathName)
      return 'active';
  }
  getCategories () {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/categories", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({categories: data.menu_category});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        // this.props.history.goBack();
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  getMenuItem (){
    var session = JSON.parse(sessionStorage.getItem('userRoles'));
    var userRoleName;
    if ( session === null ) {
      userRoleName = 'Temporary';
    }else{
      if ( session[2] ) {
        userRoleName = session[2];
      } else if ( session[1] ) {
        userRoleName = session[1];
      } else if ( session[0] ) {
        userRoleName = session[0];
      }
    }

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/items/" + userRoleName, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({menuItems: data.items });
        console.log(this.state.menuItems);
      }else if(xhr.status === 500){

      }
    }.bind(this);
    xhr.send();

  }
  handler () {
    if(this.state.loaderHidden){
      this.setState({
        loaderHidden: false
      })
    }else{
      this.setState({
        loaderHidden: true
      })
    }
  }
  render() {
    var menuItems = this.state.menuItems;
    var lang = localStorage.getItem('lang');
    if ( !this.props.panelTrue )
    {
      return (
        <nav className={'main_nav_bar navbar navbar-expand-lg navbar-light '} style={this.props.bgstyle}>
          <NavLink exact className="nav-link goHome" activeClassName="active" to="/" >{e.home}</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse"
                  data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav d-flex col-md-12">

              {this.state.categories.map(function (category, index) {
                return (
                  <li className="nav-item dropdown" key={index}>
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {lang === 'kk' &&
                      category.name_kk
                      }
                      {lang === 'ru' &&
                      category.name_ru
                      }
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      {menuItems.map(function (item, i) {
                        if (item.id_menu === category.id) {
                          if (item.type === 1) {
                            return (
                              <NavLink className="dropdown-item" to={'/page/' + item.id_page}
                                       activeClassName="active">
                                {lang === 'kk' &&
                                item.title_kk
                                }
                                {lang === 'ru' &&
                                item.title_ru
                                }

                              </NavLink>
                            )
                          } else if (item.type === 2) {
                            return (
                              <a target={'_blank'} className="dropdown-item" href={item.link}>
                                {lang === 'kk' &&
                                item.title_kk
                                }
                                {lang === 'ru' &&
                                item.title_ru
                                }
                              </a>
                            )
                          } else if (item.type === 3) {
                            return (
                              <a className="dropdown-item" href={item.link}>
                                {lang === 'kk' &&
                                item.title_kk
                                }
                                {lang === 'ru' &&
                                item.title_ru
                                }
                              </a>
                            )
                          }
                        }
                      })
                      }
                    </div>
                  </li>
                )
              })
              }
              {!this.state.loaderHidden &&
              <li className={'text-center'}>
                <Loader type="ThreeDots" color="#46B3F2" height="40" width="60"/>
              </li>
              }
              {this.state.loaderHidden &&
              <li className="nav-item map">
                <span>Карта:</span> <a className={this.giveActiveClass('/map')} target={'_blank'}
                                       href="http://3d.uaig.kz/">3D</a> | <a className={this.giveActiveClass('/map2d')}
                                                                             target={'_blank'}
                                                                             href="http://2d.uaig.kz/">2D</a>
              </li>
              }
              {this.state.loaderHidden &&
              <li><a className="nav-link last-item" target="_blank" href="/docs/doingBusiness.pdf">Doing business</a>
              </li>
              }
            </ul>
          </div>
        </nav>
      );
    }else if (this.props.panelTrue) {
      let auth = (sessionStorage.getItem('tokenInfo')) ? true : false;
      return (
        <nav className={'nav-bar-dark navbar navbar-expand-lg navbar-light fixed-line-height'} style={this.props.bgstyle}>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className={'row'}>
              <div>
                <NavLink exact className="nav-link goHomeDarkNav" activeClassName="active" to="/" >{e.home}</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
              <div className={'d-flex justify-content-between'} style={{width:'1150px'}}>
                <div className={'col-md-8 row'}>
                  <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{"color":'#ffffff !important',"fontWeight":"bold !important"}}>
                      Электронная архитектура
                    </a>
                    <div className="dropdown-menu main_nav_bar" aria-labelledby="navbarDropdown">
                      {/*  Ссылки используемые роуты  */}
                      {sessionStorage.getItem('tokenInfo') ?
                      (() => {
                        switch(JSON.parse(sessionStorage.getItem('userRoles'))[0]) {
                          case 'Admin': return <AdminMenu />;
                          case 'Reporter': return <ReporterMenu />;
                          case 'Urban':
                            if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Head') {
                              return <HeadMenu />
                            }
                            else if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Engineer') {
                              return <EngineerMenu />
                            }
                            else{
                              return <UrbanMenu />;
                            }
                          case 'Provider':
                            if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Electricity') {
                              return <ElectroProviderMenu />;
                            }
                            else if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Gas'){
                              return <GasProviderMenu />;
                            }
                            else if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Heat'){
                              return <HeatProviderMenu />;
                            }
                            else if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Phone'){
                              return <PhoneProviderMenu />;
                            }
                            else{
                              return <WaterProviderMenu />;
                            }
                          case 'Citizen': return <CitizenMenu />;
                          case 'PhotoReporter': return <PhotoReportMenu />;
                          case 'Temporary': return <TemporaryMenu />;
                          case 'ApzDepartment': return <ApzDepartmentMenu />;
                          default: return null;
                        }

                      })()
                        :
                        (<DefaultMenu />)
                      }
                      {/*  Ссылки используемые роуты  */}
                    </div>
                  </div>
                  <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{"color":'#ffffff !important',"fontWeight":"bold !important"}}>
                      Справочная информация
                    </a>
                    <div className="dropdown-menu main_nav_bar" aria-labelledby="navbarDropdown">
                      <div>
                        <NavLink to={"/panel/example-first"} replace className="dropdown-item" activeClassName="active">Место для справочной информации 1</NavLink>
                        <NavLink to={"/panel/example-second"} replace className="dropdown-item" activeClassName="active">Место для справочной информации 2</NavLink>
                        <NavLink to={"/panel/example-third"} replace className="dropdown-item" activeClassName="active">Место для справочной информации 3</NavLink>
                       </div>
                    </div>
                  </div>
                  <div className="nav-item" style={{"lineHeight":"60px"}}>
                    <span style={{marginBottom: '10px !important'}}>
                      <span style={{"color":'#ffffff',"fontWeight":"bold"}}>Карта: </span>
                      <a target={'_blank'} href="http://3d.uaig.kz/" style={{"color":"#ffffff!important","fontWeight":"bold"}}> 3D </a>
                      |
                      <a target={'_blank'} href="http://2d.uaig.kz/" style={{"color":"#ffffff!important","fontWeight":"bold"}}> 2D </a>
                    </span>
                  </div>
                </div>

                <div className="col-md-3 ml-0 regist pr-0">
                  <div className={'login_buttons pull-right clear'} style={{height:"40px","marginTop":"5px"}}>
                    {
                      (sessionStorage.getItem('logStatus') ?
                          (<LogoutBtn logout={this.props.logout.bind(this)} history={this.props.history}/>) :
                          (<LoginBtn handler={this.handler}/>)
                      )
                    }
                  </div>
                </div>

              </div> {/* end of justify-content-between class */}

            </div> {/* end of row class */}



          </div>
        </nav>


      );
    }

  }
} // end of main Class NavBar

class LoginBtn extends React.Component {
  render() {
    return(
      <div className="row" style={{paddingTop: '0'}}>
        <NavLink to={"/panel/common/login"} className="btn btn-white LoginBtn" replace>{e.login}</NavLink>&nbsp;
        <NavLink to={"/panel/common/register"} className="btn btn-white LoginBtn" replace>{e.register}</NavLink>
        <div className={"col-md-1"}></div>
      </div>
    )
  }
}

class LogoutBtn extends Component {
  constructor() {
    super();
    // this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    this.props.logout();
  }
  render() {
    return(
      <div>
        <ul>
          <li className="nav-item dropdown">
            <button className="btn btn-outline-secondary btn-white personalCabinet" href="#" id="cabinetDropdownMenuLink" data-toggle="dropdown">
              <span>{sessionStorage.getItem('userName')} <i className="glyphicon glyphicon-menu-hamburger"></i></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-right">
              <NavLink to={"/panel/common/edit-personal-data"} replace className="dropdown-item" activeClassName="active">Личные данные</NavLink>
              <NavLink to={"/panel/common/edit-password"} replace className="dropdown-item" activeClassName="active">Изменить пароль</NavLink>
              <button onClick={this.onLogout.bind(this)} className="dropdown-item" style={{cursor: 'pointer'}}>Выйти</button>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

class AdminMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/admin/user-roles"} replace className="dropdown-item" activeClassName="active">Пользователи</NavLink>
        <NavLink to={"/panel/admin/addPages"} replace className="dropdown-item" activeClassName="active">Добавить страницу</NavLink>
        <NavLink to={"/panel/admin/menuEdit"} replace className="dropdown-item" activeClassName="active">Пункты меню</NavLink>
        <NavLink to={"/panel/admin/newsPanel"} replace className="dropdown-item" activeClassName="active">Добавить новость</NavLink>
        <NavLink to={"/panel/common/vacancies"} replace className="dropdown-item" activeClassName="active">Добавить вакансии</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
        <NavLink to={"/panel/admin/usersQuestions"} replace className="dropdown-item" activeClassName="active">Вопросы пользователей</NavLink>
      </div>
    )
  }
}
class DefaultMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/common/login"} replace className="dropdown-item" activeClassName="active">Вход</NavLink>
        <NavLink to={"/panel/common/register"} replace className="dropdown-item" activeClassName="active">Регистрация</NavLink>
      </div>
    )
  }
}

class ReporterMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/admin/newsPanel"} replace className="dropdown-item" activeClassName="active">Добавить новость</NavLink>
        <NavLink to={"/panel/common/vacancies"} replace className="dropdown-item" activeClassName="active">Добавить вакансии</NavLink>
      </div>
    )
  }
}

class UrbanMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/urban/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        {/*<NavLink to={"/panel/urban/urbanreport"} replace className="dropdown-item" activeClassName="active">Фильтр</NavLink>*/}
        <NavLink to={"/panel/urban/answer-template"} replace className="dropdown-item" activeClassName="active">Шаблоны отказов</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class ElectroProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/elector-provider/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class GasProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/gas-provider/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class HeatProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/heat-provider/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class WaterProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/water-provider/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class PhoneProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/phone-provider/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class HeadMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/head/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/head/headreport"} replace className="dropdown-item" activeClassName="active">Фильтр</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class CitizenMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/citizen/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/citizen/sketch"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
        <NavLink to={"/panel/citizen/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files"} replace className="dropdown-item" activeClassName="active">Мои файлы</NavLink>
      </div>
    )
  }
}

class PhotoReportMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/photo-reporter/photoreportsManage"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
      </div>
    )
  }
}

class TemporaryMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/temporary/self-page"} replace className="dropdown-item" activeClassName="active">Личный кабинет</NavLink>
      </div>
    )
  }
}

class EngineerMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/engineer/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
      </div>
    )
  }
}

class ApzDepartmentMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/apz-department/apz"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/apz-department/sketch"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
      </div>
    )
  }
}