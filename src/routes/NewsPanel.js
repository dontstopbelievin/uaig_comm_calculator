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



export default class newsPanel extends React.Component{

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
                  <h4 className="mb-0 mt-2">Добавления новостей</h4>
                <div className="container navigational_price">
                    <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.newsPanel}
                </div>
              </div>

              <div className="card-body">
                <Switch>
                    <Route path="/newsPanel/all" component={AllNews} />
                    <Route path="/newsPanel/add" component={AddNews} />
                    <Route path="/newsPanel/update/:id" component={updateNews} />
                    <Redirect from="/newsPanel" to="/newsPanel/all" />
                </Switch>
            </div>
        
            </div>
          </div>
        
        </div>
    )
  }
}

class AllNews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      loaderHidden: false
    };

  }

  componentDidMount() {
    this.getNews();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.status !== nextProps.match.params.status) {
      this.getNews(nextProps.match.params.status);
    }
  }

  getNews() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/newsPanel", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        
        this.setState({news: data.news});
        this.setState({ loaderHidden: true });
      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this);
    xhr.send();
  }

  delete_article(e) {
    var link = 'api' + $(e.target).attr('data-link');

    if (!window.confirm('Вы действительно хотите удалить данную новость?')) {
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
        this.props.history.replace('/newsPanel');
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
                <Link className="btn btn-outline-primary mb-3" to="/newsPanel/add">Создать новость</Link>
              </div>
              
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Индекс</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Создано</th>
                  <th>Обновлено</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.news.map(function(article, index) {
                  if (article.status === 1){

                  return(
                    <tr key={index}>
                      <td >{index+1}</td>
                      <td title={article.title}>{article.title.substr(0,30)} ...</td>
                      <td title={article.description}>{article.description.substr(0,50)} ...</td>
                      <td>{article.created_at}</td>
                      <td>{article.updated_at}</td>
                      
                      <td>
                        <Link className="btn btn-outline-info col-md-8" to={'/newsPanel/update/' + article.id}>Изменить</Link>
                        <button className="btn btn-outline-danger col-md-8" data-link={'/newsPanel/delete/' + article.id} onClick={this.delete_article.bind(this)}>Удалить</button>
                      </td>
                    </tr>
                    );
                  }
                  }.bind(this))
                }

                {this.state.news.length === 0 &&
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

class AddNews extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      selectedOptions : '1',
      heading: '',
      title : '',
      desc : '',
      content: '',
      loaderHidden: false
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

    handleOptionChange (e) {
        this.setState({
            selectedOptions: e.target.value
          });
        console.log(e.target.value);
    }
  onTextChange(value){
    this.setState({content: value});
  }



    requestSubmission(e){
        e.preventDefault();
        var news = new Object();
            news.title = this.state.title;
            news.description = this.state.desc;
            news.text = this.state.content;
            news.heading_id = parseInt(this.state.selectedOptions);
        

        
        

        console.log(news);
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/newsPanel/insert',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(news),
          success: function (data) {
              console.log(data);
            alert(data.message);
              this.props.history.replace('/newsPanel/all');
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    }

    
    render() {
        return(
            <div className="container">
                <h4>Форма новой статьи</h4>
                <br/>
                <div className="col-md-8">
                    <form id="insert_form" name="form_aritcle">
                        <div className="form-group">
                            <label>Выберите рубрику новостей</label>
                        <div className="form-group">
                            <label>
                                <input value="1" type="radio" name="heading" checked={this.state.selectedOptions === '1'} onChange={this.handleOptionChange} />
                                &nbsp;Новости управления
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input value="2" type="radio" name="heading" checked={this.state.selectedOptions === '2'}    onChange={this.handleOptionChange}  />
                                &nbsp;СМИ о нас
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input value="3" type="radio" name="heading"  checked={this.state.selectedOptions === '3'}   onChange={this.handleOptionChange}  />
                                &nbsp;Кадры решают все
                            </label>
                        </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Название</label>
                            <input type="text" name="title" maxlength="150"  id="title" pleaceholder="Title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <input type="text" name="description" maxlength="150" id="description" pleaceholder="Description" className="form-control" required onChange={(e) => this.setState({desc: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Содержание статьи</label>
                            <ReactQuill value={this.state.content} onChange={this.onTextChange} />
                        </div>
                        <input type="submit" className="btn btn-outline-success" value="Отправить статью" onClick={this.requestSubmission.bind(this)} />
                        <input type="reset" className="btn btn-outline-warning" value="Очистить" />
                    </form>
                    <div>
                        <hr />
                        <Link className="btn btn-outline-secondary pull-right" id="back" to={'/newsPanel/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
                    </div>
                </div>
            </div>
        )
    }
    
    
}



class updateNews extends React.Component {
    constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);

    this.state = {
      selectedOptions : '1',
      heading: '',
      id : '',
      title : '',
      desc : '',
      content: false,
      loaderHidden: false
    };
    
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    this.getArticle();
  }

  handleOptionChange (e) {
        this.setState({
            selectedOptions: e.target.value
          });
        console.log(e.target.value);
  }
  onTextChange(value){
    this.setState({text: value});
  }
  getArticle() {
    var id = this.props.match.params.id;
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/newsPanel/edit/" + id, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var article = JSON.parse(xhr.responseText);

        this.setState({id: article.article.id});
        this.setState({title: article.article.title});
        this.setState({desc: article.article.description});
        this.setState({content: article.article.text});
        this.setState({selectedOptions: article.article.heading_id});
        console.log(this.state.id);
        console.log(this.state.content);

      } else if (xhr.status === 401) {
        sessionStorage.clear();
        alert("Время сессии истекло. Пожалуйста войдите заново!");
        this.props.history.replace("/login");
      }
    }.bind(this)
    xhr.send();
  }

    requestSubmission(e){
        e.preventDefault();
        var news = new Object();
            news.id = this.state.id;
            news.title = this.state.title;
            news.description = this.state.desc;
            news.text = this.state.content;
            news.heading_id = parseInt(this.state.selectedOptions);
        

        
        

        console.log(news);
      if (sessionStorage.getItem('tokenInfo')) {
        $.ajax({
          type: 'POST',
          url: window.url + 'api/newsPanel/update',
          contentType: 'application/json; charset=utf-8',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('tokenInfo'));
          },
          data: JSON.stringify(news),
          success: function (data) {
              console.log(data);
            alert(data.message);
              this.props.history.replace('/newsPanel/all');
          }.bind(this),
          fail: function (jqXHR) {
            alert("Ошибка " + jqXHR.status + ': ' + jqXHR.statusText);
          },
          complete: function (jqXHR) {
          }
        });
      } else { console.log('session expired'); }
    }
    
    render() {
        return(
          
            <div className="container">
                <h4>Форма исправления статьи</h4>
                <br/>
                <div className="col-md-8">
                    <form id="insert_form" name="form_aritcle">
                        <div className="form-group">
                            <label>Выберите рубрику новостей</label>
                        <div className="form-group">
                            <label>
                                <input value="1" type="radio" name="heading" checked={this.state.selectedOptions == '1'} onChange={this.handleOptionChange} />
                                &nbsp;Новости управления
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input value="2" type="radio" name="heading" checked={this.state.selectedOptions == '2'}    onChange={this.handleOptionChange}  />
                                &nbsp;СМИ о нас
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                <input value="3" type="radio" name="heading"  checked={this.state.selectedOptions == '3'}   onChange={this.handleOptionChange}  />
                                &nbsp;Кадры решают все
                            </label>
                        </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Название</label>
                            <input type="text" name="title" maxlength="150"  id="title" pleaceholder="Title" className="form-control" required onChange={(e) => this.setState({title: e.target.value})} value={this.state.title} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <input type="text" name="description" maxlength="150" id="description" pleaceholder="Description" className="form-control" required onChange={(e) => this.setState({desc: e.target.value})} value={this.state.desc}  />
                        </div>
                        <div className="form-group form3">
                            <label htmlFor="text">Содержание статьи</label>
                            {this.state.content &&

                              <ReactQuill value={this.state.content} onChange={this.onTextChange} />
                            }
                        </div>
                        <input type="submit" className="btn btn-outline-success" value="Отправить статью" onClick={this.requestSubmission.bind(this)} />
                        <input type="reset" className="btn btn-outline-warning" value="Очистить" />
                    </form>
                    <div>
                        <hr />
                        <Link className="btn btn-outline-secondary pull-right" id="back" to={'/newsPanel/'}><i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
                    </div>
                </div>
            </div>
        )
    }
    
    
}
