import React, { Component } from 'react';
import { Link } from 'react-router-dom';

var navBtnStyle = {
  backgroundColor: '#135EAD',
  border: 'none',
  cursor: 'pointer'
}

class LoginBtn extends Component {

  render() {
    return(
      <div className="row loginForm" role="group" aria-label="...">
        <Link to={"/login"} replace className="btn btn-outline-secondary" activeclassname="active">Вход</Link>&nbsp;
        <Link to={"/register"} replace  className="btn btn-outline-secondary" activeclassname="active">Регистрация</Link>
      </div>
    )
  }
}

class LogoutBtn extends Component {
  constructor() {
    super();
    
    this.onLogout = this.onLogout.bind(this);
    this.gotoCabinet = this.gotoCabinet.bind(this);
  }

  onLogout() {
    this.props.logout();
  }

  gotoCabinet() {
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = sessionStorage.getItem('userRole');
      this.props.history.replace('/' + userRole);
    }
  }

  render() {
    return(
      <div className="row userInfo">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          <li className="nav-item dropdown">
            <button className="btn btn-outline-secondary" href="#" id="cabinetDropdownMenuLink" data-toggle="dropdown">
              <span>{sessionStorage.getItem('userName')} <i className="glyphicon glyphicon-user"></i></span>
            </button>
            <div className="dropdown-menu" aria-labelledby="cabinetDropdownMenuLink">
              <button onClick={this.gotoCabinet} className="dropdown-item">Список заявлений</button>
              <Link to={"/files"} replace className="dropdown-item" activeclassname="active">Мои файлы</Link>
              <button  className="dropdown-item">Изменить пароль</button>
              <button onClick={this.onLogout} className="dropdown-item" href="#">Выход</button>
            </div>
          </li>
        </ul>
      </div>
    )
  }
}

export default class Header extends Component {
  constructor() {
    super();

    this.checkToken = this.checkToken.bind(this);
    this.goToGuest = this.goToGuest.bind(this);
  }

  goToGuest() {
    sessionStorage.clear();
    this.props.history.replace('/');
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
          this.props.history.push('/');
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
  }

  componentWillUnmount() {
    //console.log("Header will unmount");
  }

  render() {
    //console.log("rendering the Header");
    // console.log(this.props);
    return (
      <div>
        <div className="logo">
          <center><img src="http://almaty.uaig.kz/wp-content/uploads/2017/08/logo4.png" alt="Управление архитектуры и градостроительства города Алматы" /></center>
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
                <Link to={'/'} replace className="nav-link" activeclassname="active">Главная</Link>
              </li>
              <li className="nav-item">
                <Link to={'/Map'} replace className="nav-link" activeclassname="active">Карта</Link>
              </li>
              <li className="nav-item">
                <Link to={'/Photos'} replace className="nav-link" activeclassname="active">Галерея</Link>
              </li>
              <li className="nav-item">
                <Link to={'/photoreports'} replace className="nav-link" activeclassname="active">Фотоотчеты</Link>
              </li>
              <li className="nav-item">
                <Link to={'/project'} replace className="nav-link" activeclassname="active">Проект</Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" style={navBtnStyle} href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" >
                  Государственные услуги
                </button>
                <style dangerouslySetInnerHTML={{__html: `
                  .dropdown-menu .dropdown-item {
                    max-width: 100%;
                  }
                `}} />
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
            </ul>
            
            <div className="justify-content-end">
              <style dangerouslySetInnerHTML={{__html: `
                .justify-content-end {
                  padding-right: 10px;
                }
              `}} />
              {sessionStorage.getItem('logStatus') ? (
                <LogoutBtn logout={this.goToGuest} history={this.props.history} />
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