import React from 'react';
import $ from 'jquery';
import 'jquery-serializejson';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';

export default class NoticeTemplate extends React.Component {
  render() {
    return (
      <div className="content container notice-template-page">
        <div className="card">
          <div className="card-header"><h4 className="mb-0">Шаблоны уведомлений</h4></div>
          <div className="card-body">

            создать

            <Switch>
              <Route path="/notice/templates/all" component={AllTemplates} />
              <Route path="/notice/templates/add" component={AddTemplate} />
              <Route path="/notice/templates/:id" component={EditTemplate} />
              <Redirect from="/notice/templates" to="/notice/templates/all" />
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
      templates: [],
    };

  }

  componentDidMount() {
    this.getTemplates();
  }

  getTemplates() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/notice/templates", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          this.setState({ templates: JSON.parse(xhr.responseText) });
        }
      }.bind(this)
      xhr.send();
  }

  deleteTemplate(event) {
    var id =  event.target.getAttribute("data-id");
    var title =  event.target.getAttribute("data-title");
    var token = sessionStorage.getItem('tokenInfo');
    
    if (!window.confirm('Вы действительно хотите удалить шаблон "' + title + '"?')) {
      return false;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("post", window.url + "api/notice/templates/delete/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.getTemplates();
      }
    }.bind(this)
    xhr.send();
  } 

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{width: '25%'}}>Название</th>
            <th style={{width: '25%'}}>Код</th>
            <th style={{width: '33.33333%'}}>Отправка на почту</th>
            <th style={{width: '16.66667%'}}>Управление</th>
          </tr>
        </thead>
        <tbody>
          {this.state.templates.map(function(item, index){
            return(
              <tr key={index}>
                <td>{item.TitleRu}</td>
                <td>{item.Code}</td>
                <td>{item.IsExternal}</td>
                <td>
                  <Link className="btn btn-outline-info" to={'/notice/templates/' + item.Id}><i className="glyphicon glyphicon-eye-open mr-2"></i> Редактировать</Link>
                  <a className="btn btn-outline-info" data-title={item.TitleRu} data-id={item.Id} onClick={this.deleteTemplate.bind(this)}>
                    Удалить
                  </a>
                </td>
              </tr>
              );
            }.bind(this))
          }
        </tbody>
      </table>
    )
  }
}

class AddTemplate extends React.Component {
  sendForm(e) {
    var modelData = $('form').serializeJSON();
    
    if (sessionStorage.getItem('tokenInfo')) {
      $.ajax({
        type: 'POST',
        url: window.url + 'api/notice/templates/create',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
        },
        data: JSON.stringify(modelData),
        success: function (data) {
          
        }.bind(this),
      });
    }
  }

  render() {
    return(
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="TitleRu">Тема на русском языке:</label>
            <input type="text" className="form-control" required name="TitleRu" placeholder="Тема на русском языке" />
          </div>

          <div className="form-group">
            <label htmlFor="TitleKz">Тема на казахском языке:</label>
            <input type="text" className="form-control" required name="TitleKz" placeholder="Тема на казахском языке" />
          </div>

          <div className="form-group">
            <label htmlFor="Code">Код:</label>
            <input type="text" className="form-control" required name="Code" placeholder="Код" />
          </div>

          <div className="form-group">
            <label htmlFor="TextRu">Текст на русском языке:</label>
            <textarea className="form-control TextRu" id="TextRu" required name="TextRu" placeholder="Текст на русском языке"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="TextKz">Текст на казахском языке:</label>
            <textarea className="form-control" required name="TextKz" placeholder="Текст на казахском языке"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="IsExternal">Отправка на почту:</label>
            <input type="checkbox" className="form-control" name="IsExternal" />
          </div>

          <input type="button" value="Создать" onClick={this.sendForm} />
        </form>  
      </div>
      )
  }
}

class EditTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {
        Code: '',
        CreationDate: '',
        Id: '',
        IsExternal: '',
        TextKz: '',
        TextRu: '',
        TitleKz: '',
        TitleRu: ''
      },
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
    this.sendForm = this.sendForm.bind(this);
  }

  componentWillMount() {
    this.getTemplate();
  }

  getTemplate() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/notice/templates/show/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        this.setState({template: JSON.parse(xhr.responseText)});
      }
    }.bind(this)
    xhr.send();
  }

  sendForm(event) {
    var modelData = $('form').serializeJSON();
    var id = this.props.match.params.id;
    
    if (sessionStorage.getItem('tokenInfo')) {
      $.ajax({
        type: 'POST',
        url: window.url + 'api/notice/templates/edit/' + id,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
        },
        data: JSON.stringify(modelData),
        success: function (data) {
          
        }.bind(this),
      });
    }
  }

  onInputChange(event) {
    var name = event.target.getAttribute('name');
    var value = event.target.value;
    var state  = this.state.template;
    state[name] = value
    this.setState(state);
  }

  render() {
    return(
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="TitleRu">Тема на русском языке:</label>
            <input type="text" className="form-control" required name="TitleRu" placeholder="Тема на русском языке" value={this.state.template.TitleRu} onChange={this.onInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="TitleKz">Тема на казахском языке:</label>
            <input type="text" className="form-control" required name="TitleKz" placeholder="Тема на казахском языке" value={this.state.template.TitleKz} onChange={this.onInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="Code">Код:</label>
            <input type="text" className="form-control" required name="Code" placeholder="Код" value={this.state.template.Code} onChange={this.onInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="TextRu">Текст на русском языке:</label>
            <input type="text" className="form-control" required name="TextRu" placeholder="Текст на русском языке" value={this.state.template.TextRu} onChange={this.onInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="TextKz">Текст на казахском языке:</label>
            <input type="text" className="form-control" required name="TextKz" placeholder="Текст на казахском языке" value={this.state.template.TextKz} onChange={this.onInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="IsExternal">Отправка на почту:</label>
            <input type="checkbox" className="form-control" name="IsExternal" />
          </div>

          <input type="button" value="Редактировать" onClick={this.sendForm} />
        </form>  
      </div>
      )
  }
}