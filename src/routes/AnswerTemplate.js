import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import $ from 'jquery';
import { Route, Link,  Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default class AnswerTemplate extends React.Component{
  render() {
    return (
      <div className="content container body-content">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Шаблоны отказов</h4></div>
          <div className="card-body">
            <Switch>
              <Route path="/answertemplate/all/:page" component={AllTemplates} />
              <Route path="/answertemplate/add" component={AddTemplate} />
              <Route path="/answertemplate/show/:id" component={ShowTemplate} />
              <Redirect from="/answertemplate" to="/answertemplate/all/1" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

class AllTemplates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      response: null,
      pageNumbers: []
    };
  }

  componentDidMount() {
    this.getTemplates();
  }

  componentWillReceiveProps(nextProps) {
    this.getTemplates(nextProps.match.params.page);
  }

  getTemplates(page = null) {
    if (!page) {
      page = this.props.match.params.page;
    }

    this.setState({ loaderHidden: false });

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/answer_template/all" + '?page=' + page, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var pageNumbers = [];
        var start = (response.current_page - 4) > 0 ? (response.current_page - 4) : 1;
        var end = (response.current_page + 4) < response.last_page ? (response.current_page + 4) : response.last_page;
        
        for (start; start <= end; start++) {
          pageNumbers.push(start);
        }

        this.setState({pageNumbers: pageNumbers});
        this.setState({response: response});
      }

      this.setState({ loaderHidden: true });
    }.bind(this);
    xhr.send();
  }

  deleteTemplate(id, title) {
    if (!window.confirm('Вы действительно хотите удалить запись "' + title + '"?')) {
      return false;
    } 

    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/apz/answer_template/delete/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert('Шаблон успешно удален');
        this.getTemplates();
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    var page = this.props.match.params.page;
    var templates = this.state.response ? this.state.response.data : [];

    return (
      <div>
        <Link className="btn btn-outline-primary mb-3" to="/answertemplate/add">Создать шаблон</Link>

        {this.state.loaderHidden &&
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '70%'}}>Название</th>
                  <th style={{width: '20%'}}>Активность</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {templates.map(function(template, index) {
                  return(
                    <tr key={index}>
                      <td>{template.title} </td>
                      <td>
                        {template.is_active === 1 ? 
                          <p className="text-success">Активен</p>
                          :
                          <p className="text-danger">Не активен</p>
                        }
                      </td>
                      <td>
                        <div className="btn-group btn-group-xs" style={{margin: '0'}} role="group">
                          <Link className="btn btn-outline-info" to={'/answertemplate/show/' + template.id}><i className="glyphicon glyphicon-pencil mr-2"></i> Изменить</Link>
                          <button className="btn btn-outline-danger" onClick={this.deleteTemplate.bind(this, template.id, template.title)}><i className="glyphicon glyphicon-trash mr-2"></i> Удалить</button>
                        </div>
                      </td>
                    </tr>
                    );
                  }.bind(this))
                }
              </tbody>
            </table>

            {this.state.response && this.state.response.last_page > 1 &&
              <nav className="pagination_block">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" to={'/answertemplate/all/1'}>В начало</Link>
                  </li>

                  {this.state.pageNumbers.map(function(num, index) {
                    return(
                      <li key={index} className={'page-item ' + (page == num ? 'active' : '')}>
                        <Link className="page-link" to={'/answertemplate/all/' + num}>{num}</Link>
                      </li>
                      );
                    }.bind(this))
                  }
                  <li className="page-item">
                    <Link className="page-link" to={'/answertemplate/all/' + this.state.response.last_page}>В конец</Link>
                  </li>
                </ul>
              </nav>
            }
          </div>
        }
        
        {!this.state.loaderHidden && 
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}

class AddTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      isActive: '1'
    };

    this.onTextChange = this.onTextChange.bind(this);
  }

  requestSubmission(e) {
    e.preventDefault();

    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('text', this.state.text);
    formData.append('is_active', this.state.isActive);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/apz/answer_template/create', true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Шаблон успешно создан');
        this.props.history.push('/answertemplate');
      }
    }.bind(this);
    xhr.send(formData);
  }

  onTextChange(value){
    this.setState({text: value});
  }

  render() {
    return (
      <div className="container">
        <form method="post" onSubmit={this.requestSubmission.bind(this)}>
          <div className="row">
            <div className="col-sm-10">
              <div className="form-group">
                <label htmlFor="title">Название</label>
                <input type="text" maxLength="150" id="title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="form-group">
                <label htmlFor="isActive">Флаг активности</label>
                <select className="form-control" style={{background: 'none'}} onChange={(e) => this.setState({isActive: e.target.value})}>
                  <option value="1">Активен</option>
                  <option value="0">Не активен</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="text">Текст</label>
            <ReactQuill value={this.state.text} onChange={this.onTextChange} />
          </div>
          <input type="submit" className="btn btn-outline-success" value="Отправить" />
        </form>

        <div>
          <hr />
          <Link className="btn btn-outline-secondary pull-right" id="back" to={'/answertemplate/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
        </div>
      </div>
    )
  }
}

class ShowTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      text: '',
      isActive: '',
      loaderHidden: false,
    };

    this.onTextChange = this.onTextChange.bind(this);
  }

  componentWillMount() {
    this.getTemplateInfo();
  }

  getTemplateInfo() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/answer_template/detail/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        
        this.setState({title: data.title});
        this.setState({text: data.text});
        this.setState({isActive: data.is_active});
        this.setState({loaderHidden: true});
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }

  requestSubmission(e) {
    e.preventDefault();
    
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('text', this.state.text);
    formData.append('is_active', this.state.isActive);

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + 'api/apz/answer_template/update/' + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert('Шаблон успешно сохранен');
      }
    }.bind(this);
    xhr.send(formData);
  }

  onTextChange(value){
    this.setState({text: value});
  }
  
  render() {
    return (
      <div>
        {this.state.loaderHidden &&
          <div className="container">
            <form method="post" onSubmit={this.requestSubmission.bind(this)}>
              <div className="row">
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="title">Название</label>
                    <input type="text" maxLength="150" id="title" className="form-control" required value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="isActive">Флаг активности</label>
                    <select className="form-control" style={{background: 'none'}} value={this.state.isActive} onChange={(e) => this.setState({isActive: e.target.value})}>
                      <option value="1">Активен</option>
                      <option value="0">Не активен</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="text">Текст</label>
                <ReactQuill value={this.state.text} onChange={this.onTextChange} />
              </div>
              <input type="submit" className="btn btn-outline-success" value="Сохранить" />
            </form>

            <div>
              <hr />
              <Link className="btn btn-outline-secondary pull-right" id="back" to={'/answertemplate/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
            </div>
          </div>
        }
        
        {!this.state.loaderHidden &&
          <div style={{textAlign: 'center'}}>
            <Loader type="Oval" color="#46B3F2" height="200" width="200" />
          </div>
        }
      </div>
    )
  }
}