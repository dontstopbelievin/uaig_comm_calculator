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
        <nav className='navbar navbar-expand-lg navbar-dark' style={{backgroundColor:'#B0BFC5'}}>
		  <div className='container' style={{marginBottom:'0px',paddingBottom:'5px',paddingLeft:'0px',paddingRight:'0px'}} >
            <button type="button" className="navbar-toggler collapsed" data-toggle="collapse" aria-expanded='false'
	  	    aria-labelledby='Toggle navigation' data-target="#navbarSupportedContent" aria-controls='navbarSupportedContent'>
	  		  <span className="navbar-toggler-icon"></span>
		    </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav d-flex col-md-12">
			    <NavLink exact className="nav-link goHome" activeClassName="active" to="/" >{e.home}</NavLink>
                {this.state.categories.map(function (category, index) {
                  return (
                    <li className="nav-item dropdown" key={index}>
                      <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button"
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
                            }else{
                              return(<span></span>)
                            }
                          }else{
                            return(<span></span>)
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
                  <span>Карта:</span>
			    	<a className={this.giveActiveClass('/map')} target={'_blank'}
                      href="http://3d.uaig.kz/">3D</a>
			  		|
					<a className={this.giveActiveClass('/map2d')}
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
          </div>
        </nav>
      );
    }else if (this.props.panelTrue) {
      return (
        <nav className='navbar navbar-expand-lg navbar-light' style={{backgroundColor:'#B0BFC5'}}>
		  <div className='container' style={{marginBottom:'0px',paddingBottom:'5px',paddingLeft:'0px',paddingRight:'0px'}} >

			{/*Кнопка расскрытия меню для маленького дисплея*/}
			<button type="button" className="navbar-toggler collapsed" data-toggle="collapse" aria-expanded='false'
			aria-labelledby='Toggle navigation' data-target="#navbarSupportedContent" aria-controls='navbarSupportedContent'>
			  <span className="navbar-toggler-icon"></span>
			</button>

			{/*Меню*/}
			<div className="collapse navbar-collapse" id="navbarSupportedContent">

			  <ul className='navbar-nav'>
				<li className="nav-item active">
          <NavLink exact className="nav-link"to="/" >Главная<span className="sr-only">(current)</span></NavLink>
				</li>
				<li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" data-toggle='dropdown' aria-haspopup='true' aria-expanded='true' id='navbarDropdown' style={{cursor:'pointer'}}>
					Услуги
                  </a>
				  <div className="dropdown-menu" aria-labelledby='navbarDropdown'>

                    {/*  Ссылки используемые роуты  */}
                    {sessionStorage.getItem('tokenInfo') ?
                        (() => {
                          switch(JSON.parse(sessionStorage.getItem('userRoles'))[0]) {
                            case 'Admin': return <AdminMenu />;
                            case 'Urban':
                              switch (JSON.parse(sessionStorage.getItem('userRoles'))[1]) {
                                case 'Region': return <UrbanMenu />;
                                case 'Head': return <HeadMenu />;
                                case 'Engineer': return <EngineerMenu />;
                                case 'Lawyer': return <LawyerMenu />;
                                case 'GeneralPlan': return <GenPlanMenu />;
                                case 'HeadsStateServices': return <HeadsStateServicesMenu />;
                                default:
                              }
                            case 'Provider':
                              switch (JSON.parse(sessionStorage.getItem('userRoles'))[1]) {
                                case 'Electricity': return <ElectroProviderMenu />;
                                case 'Gas': return <GasProviderMenu />;
                                case 'Heat': return <HeatProviderMenu />;
                                case 'Phone': return <PhoneProviderMenu />;
                                case 'Water': return <WaterProviderMenu />;
                                default:
                              }
                            case 'Citizen': return <CitizenMenu />;
                            case 'Temporary': return <TemporaryMenu />;
                            case 'StateServices': return <StateServicesMenu />;
                            case 'Office': return <OfficeMenu />;
                            default: return null;
                          }
                        })()
                          :
                          (<DefaultMenu />)
                        }
                    {/*  Ссылки используемые роуты  */}

				  </div>
                </li> {/*dropdown*/}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" data-toggle='dropdown' style={{cursor:'pointer'}}>
			  		Справочная информация
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" target="_blank" href="/docs/InstructionGetAPZ.pdf">Инструкция по руководству АПЗ</a></li>
					{/*<NavLink to={"/panel/example-second"} replace className="dropdown-item" activeClassName="active">Место для справочной информации 2</NavLink>
					<NavLink to={"/panel/example-third"} replace className="dropdown-item" activeClassName="active">Место для справочной информации 3</NavLink>*/}
                  </ul>
                </li>{/*dropdown*/}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" data-toggle='dropdown' style={{cursor:'pointer'}}>
					Карта
                  </a>
			      <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                    <a className='dropdown-item' rel="noopener noreferrer" target='_blank' href="http://3d.uaig.kz/" >3D Карта</a>
                    <a className='dropdown-item' rel="noopener noreferrer" target='_blank' href="http://2d.uaig.kz/" >2D Карта</a>
			      </div>
                </li>{/*dropdown*/}
                <li className="nav-item dropdown">
                  <a className="nav-link goSite" href="https://almaty.uaig.kz/ru/" id="navbarDropdown" role="button">
                    Вернуться на сайт
                  </a>
                </li>{/*dropdown*/}
			  </ul>
			</div>
			   {/* collapse */}
				{/*<div className="col-md-3 ml-0 regist pr-0">*/}
				{/*<div className='login_buttons pull-right'>*/}
			{/*Статус*/}
			<div className=''>
			{
			  (sessionStorage.getItem('logStatus') ?
			    (<LogoutBtn logout={this.props.logout.bind(this)} history={this.props.history}/>) :
			    (<LoginBtn handler={this.handler}/>)
			   )
			}
			</div>
		  </div> {/* container */}
        </nav>
      );
    }
  }
} // end of main Class NavBar

class LoginBtn extends React.Component {
  render() {
    return(
	<ul style={{paddingLeft:'0px',marginBottom:'0px'}}>
      <NavLink to={"/panel/common/login"} className="btn btn-light LoginBtn" replace style={{cursor: 'pointer'}}>{e.login}</NavLink>&nbsp;
      <NavLink to={"/panel/common/register"} className="btn btn-light LoginBtn" replace style={{cursor: 'pointer'}}>{e.register}</NavLink>
    </ul>
	)
  }
}

class LogoutBtn extends Component {
  onLogout() {
    this.props.logout();
  }
  render() {
    return(

	  <ul style={{marginBottom:'0px'}}>
	    <li className='nav-item dropdown'>
          <button className="btn btn-light" href="#" id="cabinetDropdownMenuLink" data-toggle="dropdown"
		  aria-haspopup="true" aria-expanded="false">
		    <span>{sessionStorage.getItem('userName')} <i className="glyphicon glyphicon-menu-hamburger"></i></span>
		  </button>

          <div className="dropdown-menu dropdown-menu-right">
            <NavLink to={"/panel/common/edit-personal-data"} replace className="dropdown-item" activeClassName="active">Личные данные</NavLink>
            <NavLink to={"/panel/common/edit-password"} replace className="dropdown-item" activeClassName="active">Изменить пароль</NavLink>
            <button onClick={this.onLogout.bind(this)} className="dropdown-item" style={{cursor: 'pointer'}}>Выйти</button>
          </div>
	    </li>
	  </ul>
    )
  }
}

class AdminMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/admin/user-roles/1"} replace className="dropdown-item" activeClassName="active">Пользователи</NavLink>
        {/*<NavLink to={"/panel/admin/addPages"} replace className="dropdown-item" activeClassName="active">Добавить страницу</NavLink>
        <NavLink to={"/panel/admin/menuEdit"} replace className="dropdown-item" activeClassName="active">Пункты меню</NavLink>
        <NavLink to={"/panel/admin/newsPanel"} replace className="dropdown-item" activeClassName="active">Добавить новость</NavLink>
        <NavLink to={"/panel/common/vacancies"} replace className="dropdown-item" activeClassName="active">Добавить вакансии</NavLink>*/}
        <NavLink to={"/panel/admin/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Архитектурно-планировочные задания</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
        {/*<NavLink to={"/panel/admin/usersQuestions"} replace className="dropdown-item" activeClassName="active">Вопросы пользователей</NavLink>*/}
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
class UrbanMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/urban/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/urban/sketch"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        {/*<NavLink to={"/panel/urban/urbanreport"} replace className="dropdown-item" activeClassName="active">Фильтр</NavLink>*/}
        <NavLink to={"/panel/answer-template/all/apz/1"} replace className="dropdown-item" activeClassName="active">Шаблоны отказов</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class ElectroProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/elector-provider/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class GasProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/gas-provider/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class HeatProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/heat-provider/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class WaterProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/water-provider/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class PhoneProviderMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/phone-provider/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class HeadMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/head/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/head/sketch"} replace className="dropdown-item" activeClassName="active">Эскизные проекты</NavLink>
        <NavLink to={"/panel/common/photoreports"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/head/headreport"} replace className="dropdown-item" activeClassName="active">Фильтр</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Файлы</NavLink>
      </div>
    )
  }
}
class CitizenMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/services/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/services/2"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
        <NavLink to={"/panel/services/3"} replace className="dropdown-item" activeClassName="active">Заявления на фотоотчет</NavLink>
        <NavLink to={"/panel/common/files/all"} replace className="dropdown-item" activeClassName="active">Мои файлы</NavLink>
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
        <NavLink to={"/panel/engineer/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/engineer/sketch"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
        <NavLink to={"/panel/answer-template/all/apz/1"} replace className="dropdown-item" activeClassName="active">Шаблоны отказов</NavLink>
      </div>
    )
  }
}
class StateServicesMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/state_services/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/state_services/sketch"} replace className="dropdown-item" activeClassName="active">Заявления на эскизный проект</NavLink>
        <NavLink to={"/panel/answer-template/all/apz/1"} replace className="dropdown-item" activeClassName="active">Шаблоны отказов</NavLink>
      </div>
    )
  }
}
class OfficeMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/office/apz/all/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
      </div>
    )
  }
}
class LawyerMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/lawyer/apz/status/new/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
        <NavLink to={"/panel/answer-template/all/apz/1"} replace className="dropdown-item" activeClassName="active">Шаблоны отказов</NavLink>
      </div>
    )
  }
}
class GenPlanMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/gen_plan/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
      </div>
    )
  }
}
class HeadsStateServicesMenu extends Component {
  render() {
    return (
      <div>
        <NavLink to={"/panel/head_state_services/apz/status/active/1"} replace className="dropdown-item" activeClassName="active">Заявления на архитектурно-планировочное задание</NavLink>
      </div>
    )
  }
}
