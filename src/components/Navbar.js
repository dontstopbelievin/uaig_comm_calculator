import React from 'react';
import {NavLink} from 'react-router-dom';
//import '../assets/css/navbar.css';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.giveActiveClass = this.giveActiveClass.bind(this);
  }

  giveActiveClass(path) {
    if(path === this.props.pathName)
      return 'active';
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light" data-url={this.props.pathName}>
        <NavLink exact className="nav-link goHome" activeClassName="active" to="/" >ГЛАВНАЯ</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Об Управлении
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/infoaboutdepartment">Сведения о Руководстве</a>
                <a className="dropdown-item" href="#">Информация о государственном органе</a>
                <a className="dropdown-item" href="#">Деятельность исполнительного органа</a>
                <a className="dropdown-item" href="/#/timeOfReception">График приёма граждан</a>
                <a className="dropdown-item" href="/#/tutorials">Пример работы</a> 
              </div>
            </li>
            
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Государственные услуги
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Государственные символы</a></li>
                <li><a className="dropdown-item" href="#">Государственная служба</a></li>
                <li><a className="dropdown-item" href="#">Виды государственные услуг</a></li>
                <li><a className="dropdown-item" href="#">Отчет за 2017год</a></li>
                <li><a className="dropdown-item" href="#">Результаты заявления АПЗ</a></li>
                <li><a className="dropdown-item" href="#">Работа с населением</a></li>
                <li><a className="dropdown-item" href="#">Бюджетное планирование</a></li>
                <li><a className="dropdown-item" href="#">Кадровое обеспечение</a></li>
                <li><a className="dropdown-item" href="#">Предпринимательская поддержка</a></li> 
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Государственные закупки
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Планы закупок</a>
                <a className="dropdown-item" href="#">Условия участия в госзакупках</a>
                <a className="dropdown-item" href="#">Открытые конкурсы</a>
                <a className="dropdown-item" href="#">Итоги</a>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle opros" href="#" id="navbarDropdown" role="button" 
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Опрос
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/#/polls">Реконструкция пешеходных улиц 2018</a>
                <a className="dropdown-item" href="/#/designCode">Дизайн код</a>
                <a className="dropdown-item" href="/#/councilMaterials">Материалы градостроительного совета</a>
              </div>
            </li>
              
            <li className="nav-item map">
              <span>Карта:</span> <a className={this.giveActiveClass('/map')} href="/#/map">3D</a> | <a className={this.giveActiveClass('/map2d')} href="/#/map2d">2D</a>
            </li>
            <NavLink exact className="nav-link last-item" activeClassName="active" to="/doingBusiness">Doing business</NavLink>  
          </ul>
        </div>
      </nav>
    );
  }
}