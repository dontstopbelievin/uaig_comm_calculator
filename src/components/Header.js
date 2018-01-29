import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';

let e = new LocalizedStrings({ru,kk});

var navBtnStyle = {
  backgroundColor: 'rgb(0, 50, 125)',
  border: 'none',
  cursor: 'pointer'
}

export default class Header extends Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      rolename: ""
    }

    this.checkToken = this.checkToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/Account/Logout", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        sessionStorage.clear();
        this.props.history.replace('/');
      }
      else if(xhr.status === 401){
        sessionStorage.clear();
        this.props.history.replace("/");
      }
    }.bind(this);
    xhr.send();
  }

  updateLanguage(name){
    localStorage.setItem('lang', name);
    window.location.reload();
    // this.props.history.replace('/');
  }

  checkToken() {
    console.log("checkToken function started");
    var token = sessionStorage.getItem('tokenInfo');
    //var name = sessionStorage.getItem('userName');
    //var logstatus = sessionStorage.getItem('logStatus');
    if(token){
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/account/userinfo", true);
      //Send the proper header information along with the request
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          console.log("valid token");
          // this.updateLogStatus(logstatus);
          // this.updateUsername(name);
        }else {
          console.log("invalid token");
          sessionStorage.clear();
          this.props.history.replace('/');
          //alert("Your token is invalid please refresh the page.");
        }
      }.bind(this);
        xhr.send();
    }
  }

  componentWillMount() {
    //console.log("Header will mount");
    this.checkToken();
  }

  componentDidMount() {
    //console.log("Header did mount");
    if(sessionStorage.getItem('tokenInfo')){
      var roleName = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      if(roleName === 'Urban' || roleName === 'Provider' || 'Citizen'){
        roleName = JSON.parse(sessionStorage.getItem('userRoles'))[1];
        this.setState({ rolename: roleName });
      }
      else{
        this.setState({ rolename: roleName });
      }
    }
  }

  componentWillUnmount() {
    //console.log("Header will unmount");
  }

  render() {
    //console.log("rendering the Header");
    return (
      <div>
        <div className="container logo">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-2">
                  <NavLink to={'/'} replace><img width="70" src="/images/logo.png" alt="Управление Архитектуры и Градостроительства города Алматы" /></NavLink>
                </div>
                <div className="col-md-5">
                  <b>{e.title}</b>
                </div>
                <div className="col-md-5">
                  <form>
                    <div className="form-group">
                      <input type="email" className="form-control" aria-describedby="emailHelp" placeholder={e.search} />
                      <small id="emailHelp" className="form-text text-muted"><i>{e.example}: <a href="">{e.exampleText}</a></i></small>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-3 text-muted" align="center">
              {e.contactCenter}<br />
              <b>+7 (727) 279-58-24</b>
            </div>
            <div className="col-md-1 text-muted">
              {localStorage.getItem('lang') === 'kk' ?
                (<span>ҚАЗ</span>) :
                (<a style={{cursor: 'pointer', color: 'lightblue'}} onClick={this.updateLanguage.bind(this, 'kk')}>ҚАЗ</a>)
              }
              <br />
              {localStorage.getItem('lang') === 'ru' ?
                (<span>РУС</span>) :
                (<a style={{cursor: 'pointer', color: 'lightblue'}} onClick={this.updateLanguage.bind(this, 'ru')}>РУС</a>)
              }
            </div>
          </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light bg-blue">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* <a className="navbar-brand" href="/">
            Almaty.uaig.kz
          </a> */}
          <div className="container collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                {this.state.rolename === 'Region' &&
                  <NavLink to={'/urbanreport'} exact replace className="nav-link">{e.home}</NavLink>
                }
                {(this.state.rolename === 'Business' || this.state.rolename === 'Individual') &&
                  <NavLink to={'/'} exact replace className="nav-link">{e.home}</NavLink>
                }
                {this.state.rolename === 'Gas' &&
                  <NavLink to={'/'} exact replace className="nav-link">{e.home}</NavLink>
                }
                {(this.state.rolename === '' || this.state.rolename === 'Head') && 
                  <NavLink to={'/'} exact replace className="nav-link">{e.home}</NavLink>
                }
              </li>
              <li className="nav-item" style={{color: '#e9ecef', padding: '7px 0 0 10px'}}>
                Карта:
              </li>
              <li className="nav-item" style={{color: '#e9ecef', padding: '7px 10px 0 10px'}}>
                <NavLink to={'/Map'} replace style={{color: '#e9ecef'}}>{e.map}</NavLink>&nbsp;|&nbsp;
                <NavLink to={'/Map2d'} replace style={{color: '#e9ecef'}} >{e.map2d}</NavLink>
              </li>
              <li className="nav-item">

              </li>
              {/*<li className="nav-item">
                <NavLink to={'/Photos'} replace className="nav-link">{e.photos}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={'/project'} replace className="nav-link">{e.project}</NavLink>
              </li>*/}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" style={navBtnStyle} href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >
                  {e.services}
                </button>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <button className="dropdown-item" href="#">Выдача справки по определению адреса объектов недвижимости на<br /> территории Республики Казахстан</button>
                  <button className="dropdown-item" href="#">Выдача архитектурно-планировочного задания</button>
                  <button className="dropdown-item" href="#">Выдача решения на реконструкцию (перепланировку, переоборудование)<br /> помещений (отдельных частей) существующих зданий, не связанных<br /> с изменением несущих и ограждающих конструкций, инженерных<br /> систем и оборудования</button>
                  <button className="dropdown-item" href="#">Выдача решения о строительстве культовых зданий (сооружений),<br /> определении их месторасположения</button>
                  <button className="dropdown-item" href="#">Выдача решения о перепрофилировании (изменении функционального<br /> назначения) зданий (сооружений) в культовые здания (сооружения)</button>
                  <button className="dropdown-item" href="#">Предоставление земельного участка для строительства объекта<br /> в черте населенного пункта</button>
                  <button className="dropdown-item" href="#">Согласование эскиза (эскизного проекта)</button>
                  <button className="dropdown-item" href="#">Другое</button>
                 </div>
              </li>
              <li className="nav-item">
                <NavLink to={'/budget_plan'} replace className="nav-link">{e.budget_plan}</NavLink>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" style={navBtnStyle} href="#" id="additionalDropdownMenuLink" data-toggle="dropdown" >
                  {e.additional}
                </button>
                <div className="dropdown-menu" aria-labelledby="additionalDropdownMenuLink">
                  <NavLink to={'/tutorials'} replace className="dropdown-item">{e.tutorials}</NavLink>
                 </div>
              </li>
              <li className="nav-item">
                <NavLink to={'/polls'} replace className="nav-link">{e.polls}</NavLink>
              </li>
            </ul>

            <div className="justify-content-end">
              {sessionStorage.getItem('logStatus') ? (
                <LogoutBtn logout={this.logout} history={this.props.history} />
              ) : (
                <LoginBtn />
              )}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

class LoginBtn extends Component {

  render() {
    return(
      <div className="row loginForm" role="group" aria-label="...">
        <NavLink to={"/login"} replace className="btn btn-outline-secondary btn-white" activeClassName="active">{e.login}</NavLink>&nbsp;
        <NavLink to={"/register"} replace className="btn btn-outline-secondary btn-white" activeClassName="active">{e.register}</NavLink>
      </div>
    )
  }
}

class LogoutBtn extends Component {
  constructor() {
    super();

    this.onLogout = this.onLogout.bind(this);
    // this.gotoCabinet = this.gotoCabinet.bind(this);
  }

  onLogout() {
    this.props.logout();
  }

  // gotoCabinet() {
  //   if(sessionStorage.getItem('tokenInfo')){
  //     var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];;
  //     this.props.history.replace('/' + userRole);
  //   }
  // }

  render() {
    return(
      <div className="row userInfo">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          <li className="nav-item dropdown">
            <button className="btn btn-outline-secondary btn-white" href="#" id="cabinetDropdownMenuLink" data-toggle="dropdown">
              <span>{sessionStorage.getItem('userName')} <i className="glyphicon glyphicon-user"></i></span>
            </button>
            <div className="dropdown-menu" aria-labelledby="cabinetDropdownMenuLink">
              {(() => {
                switch(JSON.parse(sessionStorage.getItem('userRoles'))[0]) {
                  case 'Admin': return <AdminMenu />;
                  case 'Urban':
                    if(JSON.parse(sessionStorage.getItem('userRoles'))[1] === 'Head') {
                      return <HeadMenu />
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
                  case 'PhotoReport': return <PhotoReportMenu />;
                  case 'Temporary': return <TemporaryMenu />;
                  case 'Engineer': return <EngineerMenu />;
                  case 'Apz': return <ApzMenu />;
                  default: return null;
                }
              })()}
              <button className="dropdown-item">Изменить пароль</button>
              <button onClick={this.onLogout} className="dropdown-item" href="#">Выйти</button>
            </div>
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
        <NavLink to={"/admin"} replace className="dropdown-item" activeClassName="active">Пользователи</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class UrbanMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/urban"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class ElectroProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/providerelectro"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class GasProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/providergas"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class HeatProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/providerheat"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class WaterProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/providerwater"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class PhoneProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/providerphone"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class HeadMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/head"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}

class CitizenMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/citizen"} replace className="dropdown-item" activeClassName="active">Заявления на АПЗ</NavLink>
        <NavLink to={"/sketch"} replace className="dropdown-item" activeClassName="active">Заявления эскизного проекта</NavLink>
        <NavLink to={"/photoreports"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
        <NavLink to={"/files"} replace className="dropdown-item" activeClassName="active">Мои файлы</NavLink>
      </div>
    )
  }
}

class PhotoReportMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/photoreportsManage"} replace className="dropdown-item" activeClassName="active">Фотоотчеты</NavLink>
      </div>
    )
  }
}

class TemporaryMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/temporary"} replace className="dropdown-item" activeClassName="active">Личный кабинет</NavLink>
      </div>
    )
  }
}

class EngineerMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/engineer"} replace className="dropdown-item" activeClassName="active">Личный кабинет</NavLink>
      </div>
    )
  }
}

class ApzMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/apz"} replace className="dropdown-item" activeClassName="active">Личный кабинет</NavLink>
      </div>
    )
  }
}