import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import { Route, Link,  Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import CKEditor from "react-ckeditor-component";


let e = new LocalizedStrings({ru,kk});



export default class AddPages extends React.Component{

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
                  <h4 className="mb-0 mt-2">Добавления страниц</h4>
                <div className="container navigational_price">
                    <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.addPages}
                </div>
              </div>

              <div className="card-body">
                <Switch>
                    <Route path="/addPages/all" component={AllPages} />
                    <Route path="/addPages/add" component={AddPage} />
                    <Route path="/addPages/update/:id" component={UpdatePage} />
                    <Redirect from="/addPages" to="/addPages/all" />
                </Switch>
            </div>

            </div>
          </div>

        </div>
    )
  }
}

class AllPages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      loaderHidden: false
    };

  }

  componentDidMount() {
    this.getPages();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.getPages(nextProps.match.params.status);
    }
  }

  getPages() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/addPages", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        this.setState({pages: data.pages});
        this.setState({ loaderHidden: true });
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      } else {
        this.setState({ loaderHidden: true });
      }
    }.bind(this);
    xhr.send();
  }

  delete_article(e) {
    var link = 'api' + $(e.target).attr('data-link');

    if (!window.confirm('Вы действительно хотите удалить данную страницу?')) {
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
        this.props.history.replace('/addPages');
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
              <div className="col-sm-8">
                <Link className="btn btn-outline-primary mb-3" to="/addPages/add">Создать страницу</Link>
              </div>

            </div>
            <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Индекс</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.pages.map(function(page, index) {
                  if (page.status === 1){

                  return(
                    <tr key={index}>
                      <td >{index+1}</td>
                      <td title={page.title}>{page.title.substr(0,30)} ...</td>
                      <td title={page.description}>{page.description.substr(0,50)} ...</td>

                      <td>
                        <Link className="btn btn-outline-info col-md-8" to={'/addPages/update/' + page.id}>Изменить</Link>
                        <button className="btn btn-outline-danger col-md-8" data-link={'/addPages/delete/' + page.id} onClick={this.delete_article.bind(this)}>Удалить</button>
                      </td>
                    </tr>
                    );
                  }
                  }.bind(this))
                }

                {this.state.pages.length === 0 &&
                  <tr>
                    <td colSpan="3">Пусто</td>
                  </tr>
                }
              </tbody>
            </table>
            </div>
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

class AddPage extends React.Component {
    constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.onChange = this.onChange.bind(this);


    this.state = {
      selectedOptions : '1',
      title : '',
      value: '',
      desc : '',
      content: '',
      roles: [],
      role: '',
      loaderHidden: false
    };
  }

  componentWillMount () {
        this.getRoles();
  }
    getRoles() {
        //console.log("entered getRoles function");
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/userTable/getRoles", true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function () {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var roles = data.roles;

            this.setState({ roles: roles });
              console.log(this.state.roles);
          }
        }.bind(this);
        xhr.send();
      }
    requestSubmission(e){
        e.preventDefault();
        var page = new Object();
            page.title = this.state.title;
            page.description = this.state.desc;
            page.content = this.state.content;
            page.roleId = this.state.value;
            console.log(page);
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/addPages/insert',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(page),
          success: function (data) {
              console.log(data);
            alert(data.message);
              this.props.history.replace('/addPages/all');
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    }
    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    onChangeSelect (event) {
        var newValue = event.nativeEvent.target.value;
        this.setState({value: parseInt(newValue)});
    }
    onChange(evt){
      console.log("onChange fired with event info: ", evt);
      var newContent = evt.editor.getData();
      this.setState({
        content: newContent
      });
    }
    onBlur(evt){
      console.log("onBlur event called with event info: ", evt);
    }
    afterPaste(evt){
      console.log("afterPaste event called with event info: ", evt);
    }

    render() {
        return(
            <div className="container">
                <h4>Форма новой статичной страницы</h4>
                <br/>
                <div className="col-md-10">
                    <form id="insert_form" name="form_aritcle">
                        <div className="form-group">
                            <label htmlFor="title">Название</label>
                            <input type="text" name="title" maxlength="150"  id="title" pleaceholder="Title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <input type="text" name="description" maxlength="150" id="description" pleaceholder="Description" className="form-control" required onChange={(e) => this.setState({desc: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="role" className="col-sm-12 control-label">Доступно для роли:</label>
                          <div className="col-sm-2">
                            <select className="form-control" id="role" required onChange={this.onChangeSelect.bind(this)}>
                                <option>Добавить</option>
                              {this.state.roles.length !== 0 &&
                                this.state.roles.map(function(role, index){
                                  return(
                                      <option key={index} value={index + 1}>{role.name} </option>
                                  )
                                })
                              }
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Содержание страницы</label>
                            <CKEditor
                              activeClass="p10"
                              content={this.state.content}
                              events={{
                                "blur": this.onBlur,
                                "afterPaste": this.afterPaste,
                                "change": this.onChange
                              }}
                             />
                        </div>
                        <input type="submit" className="btn btn-outline-success" value="Отправить статью" onClick={this.requestSubmission.bind(this)} />
                        <input type="reset" className="btn btn-outline-warning" value="Очистить" />
                    </form>
                    <div>
                        <hr />
                        <Link className="btn btn-outline-secondary pull-right" id="back" to={'/addPages/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
                    </div>
                </div>
            </div>
        )
    }
}

class UpdatePage extends React.Component {
    constructor(props) {
    super(props);
    this.updateContent = this.updateContent.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      id : '',
      title : '',
      desc : '',
      value: '',
      roles: [],
      content: false,
      loaderHidden: false
    };
  }
  componentDidMount() {
    this.getPage();
    this.getRoles();
  }
  getRoles() {
        //console.log("entered getRoles function");
        var token = sessionStorage.getItem('tokenInfo');
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + "api/userTable/getRoles", true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function () {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var roles = data.roles;

            this.setState({ roles: roles });
              console.log(this.state.roles);
          }
        }.bind(this);
        xhr.send();
      }
  getPage() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/addPages/show/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var article = JSON.parse(xhr.responseText);

        this.setState({id: article.page.id});
        this.setState({title: article.page.title});
        this.setState({desc: article.page.description});
        this.setState({content: article.page.content});
        this.setState({value: article.page.role_id});

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
        var page = new Object();
            page.id = this.state.id;
            page.title = this.state.title;
            page.description = this.state.desc;
            page.content = this.state.content;
            page.roleId = this.state.value;
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/addPages/update',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(page),
          success: function (data) {
            alert(data.message);
              this.props.history.replace('/addPages/all');
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    }
  onChangeSelect (event) {
    var newValue = event.nativeEvent.target.value;
    this.setState({value: parseInt(newValue)});
  }

  updateContent(newContent) {
      this.setState({
          content: newContent
      });
  }
  onChange(evt){
    console.log("onChange fired with event info: ", evt);
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    })
  }
  onBlur(evt){
    console.log("onBlur event called with event info: ", evt);
  }
  afterPaste(evt){
    console.log("afterPaste event called with event info: ", evt);
  }

  render() {
    var value = this.state.value;
    return(
      <div className="container">
        <h4>Форма исправления статичной страницы</h4>
        <br/>
        <div className="col-md-10">
          <form id="insert_form" name="form_aritcle">
            <div className="form-group">
                <label htmlFor="title">Название</label>
                <input type="text" name="title" maxLength="150"  id="title" pleaceholder="Title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} value={this.state.title} />
            </div>
            <div className="form-group">
                <label htmlFor="description">Описание</label>
                <input type="text" name="description" maxLength="150" id="description" pleaceholder="Description" className="form-control" required onChange={(e) => this.setState({desc: e.target.value})} value={this.state.desc}  />
            </div>
            <div className="form-group">
              <label htmlFor="role" className="col-sm-12 control-label">Доступно для роли:</label>
              <div className="col-sm-2">
                <select className="form-control" id="role" required onChange={this.onChangeSelect.bind(this)}>
                    <option>Добавить</option>
                  {this.state.roles.length !== 0 &&
                    this.state.roles.map(function(role, index){
                      if( index + 1 == value ){
                        return(<option key={index} selected value={index + 1}>{role.name} </option>)
                      }else{
                        return(<option key={index} value={index + 1}>{role.name} </option>)
                      }
                    })
                  }
                </select>
              </div>
            </div>
            <div className="form-group form3">
                <label htmlFor="text">Содержание страницы</label>
                {this.state.content &&
                <CKEditor
                  activeClass="p10"
                  content={this.state.content}
                  events={{
                    "blur": this.onBlur,
                    "afterPaste": this.afterPaste,
                    "change": this.onChange
                  }}
                 />
                }
            </div>
            <input type="submit" className="btn btn-outline-success" value="Отправить статью" onClick={this.requestSubmission.bind(this)} />
            <input type="reset" className="btn btn-outline-warning" value="Очистить" />
          </form>
          <div>
            <hr />
            <Link className="btn btn-outline-secondary pull-right" id="back" to={'/addPages/'}>
              <i className="glyphicon glyphicon-chevron-left"></i>
              Назад
            </Link>
          </div>
        </div>
      </div>
    )
  }

}
