import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import { Route, Link,  Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


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
                        <button className="btn btn-outline-danger col-md-8" data-link={'/addPages/delete/' + page.id}
                                onClick={this.delete_article.bind(this)}>Удалить</button>
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


    this.state = {
      selectedOptions : '1',
      title : '',
      value: '',
      desc : '',
      content: '',
      loaderHidden: false
    };
    this.onTextChange = this.onTextChange.bind(this);
  }

  componentWillMount () {
  }

  requestSubmission(e){
      e.preventDefault();
      var page = new Object();
          page.title = this.state.title;
          page.description = this.state.desc;
          page.content = this.state.content;
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

  onTextChange(value){
    this.setState({content: value});
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
                          <label htmlFor="text">Содержание страницы</label>

                          <ReactQuill value={this.state.content} onChange={this.onTextChange} />
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
    this.onTextChange = this.onTextChange.bind(this);
    this.state = {
      id : '',
      title : '',
      desc : '',
      value: '',
      content: false,
      loaderHidden: false
    };
  }
  componentDidMount() {
    this.getPage();
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

  onTextChange(value){
    this.setState({content: value});
  }

  render() {
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
            <div className="form-group form3">
                <label htmlFor="text">Содержание страницы</label>
                {this.state.content &&
                  <ReactQuill value={this.state.content} onChange={this.onTextChange} />
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
