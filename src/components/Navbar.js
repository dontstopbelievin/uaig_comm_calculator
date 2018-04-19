import React from 'react';
import {NavLink} from 'react-router-dom';
import '../assets/css/navbar.css';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
              
        <NavLink exact className="nav-link" activeClassName="active" to="/">ГЛАВНАЯ</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <div className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="/nu" id="navbarDropdown" 
                        activeClassName="active" role="button" data-toggle="dropdown" 
                        aria-haspopup="true" aria-expanded="false">
                Деятельность управления
              </NavLink>
              <div className="dropdown-menu">
                <ul className="main-dd-menu">
                  <li className="liStyle">
                    Об Управлении<i className="glyphicon glyphicon-triangle-right iconStyle"></i>
                    <ul className="submenu">
                      <li className="liStyle">Положение Управления</li>
                      <li className="liStyle">Сведения о Руководстве</li>
                      <li className="liStyle">Структура управления</li>
                      <li className="liStyle">Подведомственные организации</li>
                      <li className="liStyle">График приёма граждан</li>
                      <NavLink exact className="nav-link liStyle" activeClassName="active" to="/tutorials">Пример работы</NavLink>
                      <li className="liStyle">Финансы</li>
                      <li className="liStyle">Контакты</li>
                    </ul>
                  </li>
                  <li className="liStyle">Государственные символы</li>
                  <li className="liStyle">
                    Государственные закупки<i className="glyphicon glyphicon-triangle-right iconStyle"></i>
                    <ul className="submenu">
                      <li className="liStyle">Планы закупок</li>
                      <li className="liStyle">Условия участия физических <br /> и юридических лиц</li>
                      <li className="liStyle">Открытые конкурсы</li>
                      <li className="liStyle">Итоги</li>
                    </ul>
                  </li>
                  <li className="liStyle">Гражданское общество</li>
                  <li className="liStyle"><a className="aTagStyle" href="/#/counteraction">Противодействие коррупции</a></li>
                  <li className="liStyle">Бюджетное планирование</li>
                  <li className="liStyle">Конституционные документы</li>
                  <li className="liStyle">Конституция РК</li>
                  <li className="liStyle">Стратегии и государственные программы РК</li>
                </ul>
              </div>
            </div>
            
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                  aria-haspopup="true" aria-expanded="false">
                Государственные услуги
              </a>
              
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Согласование эскиза (эскизного проекта)</a>
                <a className="dropdown-item" href="#">Отчет за 2017 год</a>
                <a className="dropdown-item" href="#">Статистика выданных АПЗ в текущий <br />период времени</a>
                <a className="dropdown-item" href="#">Виды государственных услуг</a>
              </div>
            </div>
            
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                  aria-haspopup="true" aria-expanded="false">
                Нормативно-правовая база
              </a>
              
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/npm">Законы</a>
                <a className="dropdown-item" href="#">Правила</a>
                <a className="dropdown-item" href="#">Отчеты и обсуждения</a>
              </div>
            </div>

            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle opros" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                  aria-haspopup="true" aria-expanded="false">                    
                Опрос
              </a>

              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/polls">Реконструкция пешеходных улиц 2018</a>
                <a className="dropdown-item" href="/#/designCode">Дизайн код</a>
                <a className="dropdown-item" href="/#/councilMaterials">Материалы градостроительного совета</a>
              </div>
            </div>  
          
            <div className="nav-item map">Карта: <a href="/#/map">3D</a> | <a href="/#/map2d">2D</a></div>
            
            <div className="nav-item">
              <NavLink exact className="nav-link last-item" activeClassName="active" to="/doingBusiness">Doing business</NavLink>
            </div>                 
          </ul>
        </div>   
      </nav>
    );
  }
}