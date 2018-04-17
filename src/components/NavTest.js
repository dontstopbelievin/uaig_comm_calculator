import React from 'react';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
              
        <a className="bg-primary text-white navbar-item home active"  href="#">ГЛАВНАЯ</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Деятельность управления
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  
                <li className="dropdown-submenu dropdown-item">
                  <a className="test font-weight-normal " href="#">Об Управлении<img src="./img/sub_icon.png" /></a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">Положение Управления</a></li>
                    <li><a className="dropdown-item" href="#">Сведения о Руководстве</a></li>
                    <li><a className="dropdown-item" href="#">Структура управления</a></li>
                    <li><a className="dropdown-item" href="#">Подведомственные организации</a></li>
                    <li><a className="dropdown-item" href="#">График приёма граждан</a></li>
                    <li><a className="dropdown-item" href="#">Пример работы</a></li>
                    <li><a className="dropdown-item" href="#">Финансы</a></li>
                    <li><a className="dropdown-item" href="#">Контакты</a></li>
                  </ul>
                </li>

                <li><a className="dropdown-item" href="#">Государственные символы</a></li>
                  
                <li className="dropdown-submenu dropdown-item">
                  <a className="test font-weight-normal" href="#">Государственные закупки<img src="./img/sub_icon.png" /></a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">Планы закупок</a></li>
                    <li><a className="dropdown-item" href="#">Условия участия физических и юридических лиц</a></li>
                    <li><a className="dropdown-item" href="#">Открытые конкурсы</a></li>
                    <li><a className="dropdown-item" href="#">Итоги</a></li>
                  </ul>
                </li>

                <li><a className="dropdown-item" href="#">Гражданское общество</a></li>
                <li><a className="dropdown-item" href="#">Противодействие коррупции</a></li>
                <li><a className="dropdown-item" href="#">Бюджетное планирование</a></li>
                <li><a className="dropdown-item" href="#">Конституционные документы</a></li>
                <li><a className="dropdown-item" href="#">Конституция РК</a></li>
                <li><a className="dropdown-item" href="#">Стратегии и государственные программы РК</a></li>
              </ul>
            </li>
            
            <li className="nav-item dropdown">
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
            </li>
            
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                  aria-haspopup="true" aria-expanded="false">
                Нормативно-правовая база
              </a>
              
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Законы</a>
                <a className="dropdown-item" href="#">Правила</a>
                <a className="dropdown-item" href="#">Отчеты и обсуждения</a>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle opros" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                  aria-haspopup="true" aria-expanded="false">                    
                Опрос
              </a>

              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Реконструкция пешеходных улиц 2018</a>
                <a className="dropdown-item" href="#">Дизайн код</a>
                <a className="dropdown-item" href="#">Материалы градостроительного совета</a>
              </div>
            </li>  
          
            <li className="nav-item map">Карта: <a href="#">3D</a> | <a href="#">2D</a></li>
            
            <li className="nav-item">
              <a className="nav-link last-item" href="#">Doing business</a>
            </li>                 
          </ul>
        </div>   
      </nav>
    )
  }
}