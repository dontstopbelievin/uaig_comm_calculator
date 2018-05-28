import React from 'react';
import {NavLink} from 'react-router-dom';
import {ru, kk} from '../languages/header.json';
import LocalizedStrings from 'react-localization';
//import '../assets/css/navbar.css';
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
    this.getCategories();
    this.getMenuItem();
  }

  componentWillReceiveProps(nextProps) {
    this.getCategories();
    this.getMenuItem();
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
        this.props.history.goBack();
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
        this.setState({ loaderHidden: true });
        console.log(this.state.menuItems);
      }else if(xhr.status === 500){

      }
    }.bind(this);
    xhr.send();

  }

  render() {
    var menuItems = this.state.menuItems;
    var lang = localStorage.getItem('lang');
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
        <NavLink exact className="nav-link goHome" activeClassName="active" to="/" >{e.home}</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" 
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">

            {this.state.categories.map(function (category, index) {
              return(
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
                    if(item.id_menu === category.id ) {
                      if(item.type === 1){
                        return(
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
                      }else if(item.type === 2){
                        return(
                          <a target={'_blank'} className="dropdown-item" href={item.link}>
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

            

              {/*#######################################################################################################
              ##########################################################################################################*/}
            <li className="nav-item map">
              <span>Карта:</span> <a className={this.giveActiveClass('/map')} href="/#/map">3D</a> | <a className={this.giveActiveClass('/map2d')} href="/#/map2d">2D</a>
            </li>
            <li><a className="nav-link last-item" target="_blank" href="/docs/doingBusiness.pdf">Doing business</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}