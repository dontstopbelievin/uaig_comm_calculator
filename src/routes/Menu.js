import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import { Route, Link,  Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';


let e = new LocalizedStrings({ru,kk});



export default class Menu extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
        tokenExists: false,
        rolename: ""
    }
  }

  render() {
    return (
      <div className="container body-content">



          <div className="content container citizen-apz-list-page">
          <div className="card">
            <div className="card-header">
                <h4 className="mb-0 mt-2">Добавления пунктов меню</h4>
              <div className="container navigational_price">
                  <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.newsPanel}
              </div>
            </div>

            <div className="card-body">
              <Switch>
                  <Route path="/menuEdit/all" component={AllItems} />
                  <Route path="/menuEdit/addItem" component={AddItem} />
                  <Route path="/menuEdit/editItem/:id" component={UpdateItem} />
                  <Route path="/menuEdit/addCategory" component={AddCategory} />
                  <Redirect from="/menuEdit" to="/menuEdit/all" />
              </Switch>
          </div>

          </div>
        </div>

      </div>
    )
  }
}

class AllItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      loaderHidden: false
    };

  }

  componentDidMount() {
    this.getItems();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.getItems(nextProps.match.params.status);
    }
  }

  getItems() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);

        this.setState({items: data.menu_item});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных!');
        this.props.history.replace("/");
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }

  delete(e) {
    var link = 'api' + $(e.target).attr('data-link');
    if (!window.confirm('Вы действительно хотите удалить данный элемент?')) {
      return false;
    }

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + link, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Запись была успешно удалена!');
        var id = $(e.target).attr('data-delete');
        var list = this.state.items;
        var index = list.indexOf(id);
        list.splice(index,1);
        this.setState({items: list});
      } else {
        alert("При удалении произошла ошибка!");
      }
    }.bind(this);
    xhr.send();
  }



  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div>
            <div className="row">
              <div className="col-sm-3">
                <Link className="btn btn-outline-primary mb-3" to="/menuEdit/addItem">Создать пункт меню</Link>
              </div>
              <div className="col-sm-3">
                <Link className="btn btn-outline-primary mb-3" to="/menuEdit/addCategory">Изменить категории</Link>
              </div>
            </div>


            <table className="table">
              <thead>
                <tr className={'row'}>
                  <th className={'col-md-1'}>Индекс</th>
                  <th className={'col-md-4'}>Название</th>
                  <th className={'col-md-2'}>Ссылка</th>
                  <th className={'col-md-3'}>Создано</th>
                  <th className={'col-md-2'}></th>
                </tr>
              </thead>
              <tbody>
                {this.state.items.map(function(item, index) {
                  return(
                    <tr key={index} className={'row'}>
                      <td className={'col-md-1'}>{index + 1}</td>
                      <td className={'col-md-4'} title={item.title_kk + ' | ' + item.title_ru}>
                        Қаз: <strong>{item.title_kk} </strong><br/>
                        Рус: <strong>{item.title_ru}</strong>
                      </td>
                      <td className={'col-md-2'}>
                        {item.type === 1 &&
                          <NavLink className="btn btn-outline-success col-md-12 btn-sm" to={'/page/'+item.id_page}> Перейти </NavLink>
                        }
                        {item.type === 2 &&
                          <a target="_blank" className="btn btn-outline-info col-md-12 btn-sm" href={item.link}> Перейти </a>
                        }
                        {item.type === 3 &&
                          <a className="btn btn-outline-warning col-md-12 btn-sm" href={item.link}> Перейти </a>
                        }
                      </td>
                      <td className={'col-md-3'}>{item.created_at}</td>

                      <td className={'col-md-2'}>
                        <Link className="btn btn-outline-info col-md-12" to={'/menuEdit/editItem/' + item.id}>Изменить</Link><br/>
                        <button className="btn btn-outline-danger col-md-12"
                                data-link={'/menu/delete/' + item.id}
                                data-delete={item.id}
                                onClick={this.delete.bind(this)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }

                {this.state.items.length === 0 &&
                  <tr>
                    <td colSpan="3">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="100" width="100" />
          </div>
        }
      </div>
    )
  }
}

class AddItem extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    titleru : '',
    titlekk : '',
    categories: [],
    category : '',
    roles: [],
    roleId: '',
    type: '',
    link: '',
    interlalLink: '',
    pages: [],
    pageId: '',
    loaderHidden: false
  };
  }
  componentWillMount() {
    this.getCategories();
    this.getPages();
    this.getRoles();
  }
  handleTitleKK (e) {
    this.setState({titlekk: e.target.value});
  }
  handleTitleRU (e) {
    this.setState({titleru: e.target.value});
  }
  handleLink (e) {
    this.setState({link: e.target.value});
  }
  handleCategorySelect (e) {
    this.setState({category: e.target.value});
  }
  handleInterlalLink (e) {
      this.setState({interlalLink: e.target.value});
  }
  handlePageSelect (e) {
    this.setState({pageId: e.target.value});
  }
  handleTypeSelect (e) {
    this.setState({type: e.target.value});
  }
  handleRoleSelect (e) {
    this.setState({roleId: e.target.value});
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
        console.log(data);

        this.setState({categories: data.menu_category});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных категории!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  getRoles () {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/roles", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);

        this.setState({roles: data.roles});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных ролей!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  getPages () {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/pages", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);

        this.setState({pages: data.pages});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных статичных страниц!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  requestSubmission(e){
      e.preventDefault();
      var token = sessionStorage.getItem('tokenInfo');
      var item = new Object();
          item.title_kk = this.state.titlekk;
          item.title_ru = this.state.titleru;
          item.id_menu = parseInt(this.state.category);
          item.role_id = parseInt(this.state.roleId);
          item.type = parseInt(this.state.type);
          if (item.type === 1){
            item.id_page = parseInt(this.state.pageId);
          }else if (item.type === 2) {
            item.link = this.state.link;
          }else if (item.type === 3) {
            item.link = this.state.interlalLink;
          }
          console.log(item);
    if (sessionStorage.getItem('tokenInfo')) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/menu/insert", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert('Элемент добавлен!');
          this.props.history.replace("/menuEdit");
        }else if(xhr.status === 500){
          alert('Не получилось добавить в базу данных!');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send(JSON.stringify(item));

    } else { console.log('session expired'); }
  }

  render() {
    return(
      <div className="container">
        <h4>Форма нового элемента меню</h4>
        <br/>
        <div className="col-md-8">
          <form id="insert_form" name="form_aritcle">
            <fieldset className="form-group">
              <div className='row'>
              <legend class="col-form-label col-sm-2 pt-0">Названии</legend>
                <div className={'col-sm-10'}>
                  <div className={'form-group'}>
                    <label>Қазақша:</label>
                    <input type={'text'}
                           name={'title_ru'}
                           className={'form-control'}
                           onChange={this.handleTitleKK.bind(this)}
                           required={true}
                           placeholder={'Input a title on Qazakh lang'} />
                  </div>
                  <div className={'form-group'}>
                    <label>На Русском:</label>
                    <input type={'text'}
                           name={'title_kk'}
                           className={'form-control'}
                           onChange={this.handleTitleRU.bind(this)}
                           required={true}
                           placeholder={'Input a title on Qazakh lang'} />
                  </div>
                </div>
              </div>
            </fieldset>
            <div className={'form-group'}>
              <label>Категория</label>
              <select className={'form-control'} required={true} onChange={this.handleCategorySelect.bind(this)}>
                <option>Выберите элемент</option>
                {this.state.categories.map(function (category,i) {
                    return(
                      <option key={i} value={category.id}>{category.name_kk + ' | ' + category.name_ru}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className={'form-group'}>
              <label>Тип</label>
              <select className={'form-control'} required={true} onChange={this.handleTypeSelect.bind(this)}>
                <option>Выберите элемент</option>
                <option value="1">Страница</option>
                <option value="2">Ссылка</option>
                <option value="3">Внутренняя ссылка</option>
              </select>
            </div>
            <div className={'form-group'}>
              <label>Для ролей</label>
              <select className={'form-control'} required={true} onChange={this.handleRoleSelect.bind(this)}>
                <option>Выберите элемент</option>
                {this.state.roles.map(function (role,index) {
                  return(
                    <option value={role.id}>{role.name}</option>
                  )
                })

                }
              </select>
            </div>
            {this.state.type === '3' &&
            <div className={'form-group'}>
              <label>Внутренняя ссылка</label>
              <input type={'text'}
                     name={'link'}
                     className={'form-control'}
                     onChange={this.handleInterlalLink.bind(this)}
                     required={true} />
            </div>
            }
            {this.state.type === '2' &&
              <div className={'form-group'}>
                <label>Ссылка</label>
                <input type={'text'}
                           name={'link'}
                           className={'form-control'}
                           onChange={this.handleLink.bind(this)}
                           required={true} />
              </div>
            }
            {this.state.type === '1' &&
              <div className={'form-group'}>
                <label>Страница</label>
                <select className={'form-control'} required={true} onChange={this.handlePageSelect.bind(this)}>
                  <option>Выберите элемент</option>
                  {this.state.pages.map(function (page,i) {
                      return(
                        <option key={i} title={page.description} value={page.id}>{page.title}</option>
                      )
                    })
                  }
                </select>
              </div>
            }

            <input type="button"
                   className="btn btn-outline-success"
                   value="Сохранить"
                   onClick={this.requestSubmission.bind(this)} />
          </form>
          <div>
              <hr />
              <Link className="btn btn-outline-secondary pull-right"
                    id="back" to={'/menuEdit/'}>
                <i className="glyphicon glyphicon-chevron-left"></i>
                Назад
              </Link>
          </div>
        </div>
        </div>
    )
  }

}



class UpdateItem extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    titleru : '',
    titlekk : '',
    id: '',
    categories: [],
    category : '',
    roles: [],
    roleId: '',
    type: '',
    link: '',
    internalLink: '',
    linkSec: '',
    pages: [],
    pageId: '',
    loaderHidden: false
  };
  }
  componentDidMount() {
    this.getItemMenu();
  }
  componentWillMount() {
    this.getCategories();
    this.getPages();
    this.getRoles();
  }
  handleTitleKK (e) {
    this.setState({titlekk: e.target.value});
  }
  handleTitleRU (e) {
    this.setState({titleru: e.target.value});
  }
  handleLink (e) {
    this.setState({link: e.target.value});
  }
  handleCategorySelect (e) {
    this.setState({category: e.target.value});
  }
  handleInternalLink (e) {
      this.setState({internalLink: e.target.value});
  }
  handlePageSelect (e) {
    this.setState({pageId: e.target.value});
  }
  handleTypeSelect (e) {
    this.setState({type: e.target.value});
  }
  handleRoleSelect (e) {
    this.setState({roleId: e.target.value});
  }
  getItemMenu() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/show/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data.item);
        this.setState({id: data.item.id});
        this.setState({titlekk: data.item.title_kk});
        this.setState({titleru: data.item.title_ru});
        this.setState({category: data.item.id_menu});
        this.setState({roleId: data.item.role_id});
        this.setState({type: data.item.type});
        if (data.item.type === 1){
            this.setState({pageId: data.item.id_page});
          }else if (data.item.type === 2) {
            this.setState({link: data.item.link});
          }else if (data.item.type === 3) {
            this.setState({internalLink: data.item.link});
          }

      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
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
        console.log(data);

        this.setState({categories: data.menu_category});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных категории!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  getRoles () {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/roles", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);

        this.setState({roles: data.roles});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных ролей!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  getPages () {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/menu/pages", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);

        this.setState({pages: data.pages});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных статичных страниц!');
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  requestSubmission(e){
      e.preventDefault();
      var token = sessionStorage.getItem('tokenInfo');
      var item = new Object();
          item.id = this.state.id;
          item.title_kk = this.state.titlekk;
          item.title_ru = this.state.titleru;
          item.id_menu = parseInt(this.state.category);
          item.role_id = parseInt(this.state.roleId);
          item.type = parseInt(this.state.type);
          if (item.type === 1){
            item.id_page = parseInt(this.state.pageId);
          }else if (item.type === 2) {
            item.link = this.state.link;
          }else if (item.type === 3){
            item.link = this.state.internalLink;
          }
    if (sessionStorage.getItem('tokenInfo')) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/menu/update/" + this.state.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert('Элемент добавлен!');
          this.props.history.replace("/menuEdit");
        }else if(xhr.status === 500){
          alert('Не получилось добавить в базу данных!');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send(JSON.stringify(item));

    } else { console.log('session expired'); }
  }

  render() {
    return(
      <div className="container">
        <h4>Форма нового элемента меню</h4>
        <br/>
        <div className="col-md-8">
          <form id="insert_form" name="form_aritcle">
            <fieldset className="form-group">
              <div className='row'>
              <legend class="col-form-label col-sm-2 pt-0">Названии</legend>
                <div className={'col-sm-10'}>
                  <div className={'form-group'}>
                    <label>Қазақша:</label>
                    <input type={'text'}
                           name={'title_ru'}
                           value={this.state.titlekk}
                           className={'form-control'}
                           onChange={this.handleTitleKK.bind(this)}
                           required={true}
                           placeholder={'Input a title on Qazakh lang'} />
                  </div>
                  <div className={'form-group'}>
                    <label>На Русском:</label>
                    <input type={'text'}
                           name={'title_kk'}
                           className={'form-control'}
                           value={this.state.titleru}
                           onChange={this.handleTitleRU.bind(this)}
                           required={true}
                           placeholder={'Input a title on Qazakh lang'} />
                  </div>
                </div>
              </div>
            </fieldset>
            <div className={'form-group'}>
              <label>Категория</label>
              <select className={'form-control'} value={this.state.category} required={true} onChange={this.handleCategorySelect.bind(this)}>
                <option>Выберите элемент</option>
                {this.state.categories.map(function (category,i) {
                    return(
                      <option key={i} value={category.id}>{category.name_kk + ' | ' + category.name_ru}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className={'form-group'}>
              <label>Тип</label>
              <select className={'form-control'} value={this.state.type} required={true} onChange={this.handleTypeSelect.bind(this)}>
                <option>Выберите элемент</option>
                <option value="1">Страница</option>
                <option value="2">Ссылка</option>
                <option value="3">Внутренняя ссылка</option>
              </select>
            </div>
            <div className={'form-group'}>
              <label>Для ролей</label>
              <select className={'form-control'} value={this.state.roleId} required={true} onChange={this.handleRoleSelect.bind(this)}>
                <option>Выберите элемент</option>
                {this.state.roles.map(function (role,index) {
                  return(
                    <option value={role.id}>{role.name}</option>
                  )
                })

                }
              </select>
            </div>
            {this.state.type == '3' &&
            <div className={'form-group'}>
              <label>Внутреняя ссылка</label>
              <input type={'text'}
                     name={'link'}
                     className={'form-control'}
                     value={this.state.internalLink}
                     onChange={this.handleInternalLink.bind(this)}
                     required={true} />
            </div>
            }
            {this.state.type == '2' &&
              <div className={'form-group'}>
                <label>Ссылка</label>
                <input type={'text'}
                         name={'link'}
                         className={'form-control'}
                         value={this.state.link}
                         onChange={this.handleLink.bind(this)}
                         required={true} />
              </div>
            }
            {this.state.type == '1' &&
              <div className={'form-group'}>
                <label>Страница</label>
                <select className={'form-control'} value={this.state.pageId} required={true} onChange={this.handlePageSelect.bind(this)}>
                  <option>Выберите элемент</option>
                  {this.state.pages.map(function (page,i) {
                      return(
                        <option key={i} title={page.description} value={page.id}>{page.title}</option>
                      )
                    })
                  }
                </select>
              </div>
            }

            <input type="button"
                   className="btn btn-outline-success"
                   value="Сохранить"
                   onClick={this.requestSubmission.bind(this)} />
          </form>
          <div>
              <hr />
              <Link className="btn btn-outline-secondary pull-right"
                    id="back"
                    to={'/menuEdit/'}>
                <i className="glyphicon glyphicon-chevron-left"></i>
                Назад
              </Link>
          </div>
        </div>
        </div>
    )
  }


}

class AddCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      namekk: '',
      nameru: '',
      loaderHidden: false
    };
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentDidMount() {
    this.getCategories ();
  }
  handleTitleKK (e) {
      this.setState({ namekk: e.target.value });
  }
  handleTitleRU (e) {
      this.setState({ nameru: e.target.value });
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
        console.log(data);

        this.setState({categories: data.menu_category});
        this.setState({ loaderHidden: true });
      }else if(xhr.status === 500){
        alert('Не получилось найти в базе данных категории!');
        this.props.history.goBack();
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }
  requestSubmission(e){
    e.preventDefault();
    var token = sessionStorage.getItem('tokenInfo');
    var item = new Object();
        item.name_kk = this.state.namekk;
        item.name_ru = this.state.nameru;
    console.log(item);
    if (sessionStorage.getItem('tokenInfo')) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/menu/category/insert", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert('Элемент добавлен!');
          this.getCategories();
        }else if(xhr.status === 500){
          alert('Не получилось добавить в базу данных!');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send(JSON.stringify(item));

    } else { console.log('session expired'); }
  }

  deleteCategory (id) {
    if (!window.confirm('Вы действительно хотите удалить данный элемент?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (sessionStorage.getItem('tokenInfo')) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + 'api/menu/category/delete/' + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          alert('Элемент удален!');
          this.getCategories();
        }else if(xhr.status === 500){
          alert('Не получилось добавить в базу данных!');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.replace("/login");
        }
      }.bind(this);
      xhr.send();

    } else { console.log('session expired'); }
  }

  render(){
    return(
      <div className="container">
        <h4>Форма новой категории меню</h4>
        <br/>
        <div className="col-md-12">
          <div className={'row'}>
            <div className={'col-md-6'}>

              {this.state.categories.map(function ( category, index ) {
                return(
                  <div key={index} className="btn-group btn-group-md mb-4" role="group">
                    <button type="button"
                            disabled={true}
                            className="btn btn-primary btn-md">
                      {category.name_kk + ' | ' + category.name_ru}
                    </button>

                    <button type="submit"
                            className="btn btn-danger btn-md"
                            onClick={this.deleteCategory.bind(this, category.id)} >
                      <i className="glyphicon glyphicon-trash"></i>
                    </button>
                  </div>
                )
              }.bind(this))
              }
            </div>
            <div className={'col-md-6'}>
              <form>
                <h6>Добавить элемент</h6>
                <fieldset className="form-group">
                  <div className='row'>
                    <legend className="col-form-label col-sm-3 pt-0">Названии:</legend>
                    <div className={'col-sm-9'}>
                      <div className={'form-group'}>
                        <label>Қазақша:</label>
                        <input type={'text'}
                               name={'title_ru'}
                               className={'form-control'}
                               onChange={this.handleTitleKK.bind(this)}
                               required={true}
                               placeholder={'Input a title on Qazakh lang'}/>
                      </div>
                      <div className={'form-group'}>
                        <label>На Русском:</label>
                        <input type={'text'}
                               name={'title_kk'}
                               className={'form-control'}
                               onChange={this.handleTitleRU.bind(this)}
                               required={true}
                               placeholder={'Input a title on Qazakh lang'}/>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <input type="button"
                   className="btn btn-outline-success btn-arrow-right"
                   value="Сохранить"
                   onClick={this.requestSubmission.bind(this)} />
              </form>
            </div><hr />
              <Link className="btn btn-outline-secondary pull-right"
                    id="back"
                    to={'/menuEdit/'}>
                <i className="glyphicon glyphicon-chevron-left"></i>
                Назад
              </Link>
          </div>
        </div>
      </div>
    )
  }



}
