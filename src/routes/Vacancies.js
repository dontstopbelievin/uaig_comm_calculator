import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/vacancies.json';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU';
import $ from "jquery"; // you can import any other locale

let e = new LocalizedStrings({ru,kk});

export default class Vacancies extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      rolename: ""
    }
  }

  render() {
    return(
      <div className="content container body-content citizen-apz-list-page">

        <div>
          <div>
            <Switch>
              <Route path="/panel/common/vacancies/active/:status" exact render={(props) =>(
                <AllVacancies {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/common/vacancies/disable/:status" exact render={(props) =>(
                <AllVacancies {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/common/vacancies/trashed/:status" exact render={(props) =>(
                <TrashedVacancies {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/common/vacancies/add" exact render={(props) =>(
                <AddVacancy {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/common/vacancies/update/:id" exact render={(props) =>(
                <ShowVacancies {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/common/vacancies" to="/panel/common/vacancies/active/1" />
            </Switch>
          </div>
        </div>

      </div>
    )
  }
}

class AllVacancies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      vacancies: []
    };

  }
  componentDidMount() {
    this.props.breadCrumbs();
    this.getVacancies();
  }
  componentWillReceiveProps(nextProps) {
    this.props.breadCrumbs();
    this.getVacancies(nextProps.match.params.status);
  }
  getVacancies(status = null) {
    if (!status) {
      status = this.props.match.params.status;
    }
    this.setState({ loaderHidden: false });
    var token = sessionStorage.getItem('tokenInfo');

    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/all/" + status, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          this.setState({vacancies: data.vacancies});
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }

  }
  showVacancy(id) {
    this.props.history.push('/panel/common/vacancies/update/' + id);
  }
  deleteTheVacancy(index) {
    if (!window.confirm('Вы действительно хотите удалить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      let id = this.state.vacancies[index].id;
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/delete/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let vacancies = this.state.vacancies;
          vacancies.splice(index,1);
          this.setState({vacancies: vacancies});
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  disableTheVacancy(index) {
    if (!window.confirm('Вы действительно хотите отключить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      let id = this.state.vacancies[index].id;
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/disable/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let vacancies = this.state.vacancies;
          vacancies.splice(index,1);
          this.setState({vacancies: vacancies});
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  unDisableTheVacancy(index) {
    if (!window.confirm('Вы действительно хотите включить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      let id = this.state.vacancies[index].id;
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/un-disable/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let vacancies = this.state.vacancies;
          vacancies.splice(index,1);
          this.setState({vacancies: vacancies});
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }

  render() {
    var status = this.props.match.params.status;
    var vacancies = this.state.vacancies;
    return (
      <div>

        <div>
          <h4 className="mb-0 mt-2">Все вакансии</h4><br/>
          <div className="row">
            <div className="col-sm-7">
              <Link className="btn btn-outline-primary mb-3" to="/panel/common/vacancies/add">Создать вакансию</Link>
            </div>
            <div className="col-sm-5 statusActive">
              <ul className="nav nav-tabs mb-2 pull-right">
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === '1'} activeStyle={{color:"black"}} to="/panel/common/vacancies/active/1" replace>Активные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === '2'} activeStyle={{color:"black"}} to="/panel/common/vacancies/disable/2" replace>Отключенные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'all'} activeStyle={{color:"black"}} to="/panel/common/vacancies/trashed/all" replace>Удаленные</NavLink></li>
              </ul>
            </div>
          </div>

          {this.state.loaderHidden &&
            <table className="table">
              <thead>
              <tr>
                <th style={{width: '10%'}}>#</th>
                <th style={{width: '23%'}}>Название</th>
                <th style={{width: '33%'}}>Описание</th>
                <th style={{width: '20%'}}>Создано</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {vacancies.map(function(vacancy, index) {
                return(
                  <tr key={index} style={{cursor: "pointer"}}>
                    <td onClick={this.showVacancy.bind(this,vacancy.id)}>{index + 1}</td>
                    <td onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.title}</td>
                    <td onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.description}</td>
                    <td title={'Обнавлено последний раз: ' + vacancy.updated_at} onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.created_at}</td>
                    <td>
                      <button className="btn btn-outline-danger" onClick={this.deleteTheVacancy.bind(this,index)}><i className="glyphicon glyphicon-remove mr-2"></i> Удалить</button>
                      {vacancy.status === 1 ?
                        (<button className="btn btn-outline-warning" onClick={this.disableTheVacancy.bind(this, index)}><i className="glyphicon glyphicon-off mr-2"></i> Отключить</button>)
                        :
                        (<button className="btn btn-outline-info" onClick={this.unDisableTheVacancy.bind(this, index)}><i className="glyphicon glyphicon-off mr-2"></i> Включить</button>)
                      }
                    </td>
                  </tr>
                );
              }.bind(this))
              }

              {vacancies.length === 0 &&
                <tr>
                  <td colSpan="5">Пусто</td>
                </tr>
              }
              </tbody>
            </table>
          }
        </div>

        {!this.state.loaderHidden &&
        <div style={{textAlign: 'center'}}>
          <Loader type="Oval" color="#46B3F2" height="200" width="200" />
        </div>
        }
      </div>
    )
  }
}
class TrashedVacancies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      vacancies: []
    };

  }
  componentDidMount() {
    this.props.breadCrumbs();
    this.getVacancies();
  }
  componentWillReceiveProps(nextProps) {
    this.getVacancies(nextProps.match.params.status);
  }
  showVacancy(id) {
    this.props.history.push('/panel/common/vacancies/update/' + id);
  }
  getVacancies() {
    this.setState({ loaderHidden: false });
    var token = sessionStorage.getItem('tokenInfo');

    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/allTrashed", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          this.setState({vacancies: data.vacancies});
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }

  }
  recoveryTheVacancy(index) {
    if (!window.confirm('Вы действительно хотите востановить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      let id = this.state.vacancies[index].id;
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/recovery/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let vacancies = this.state.vacancies;
          vacancies.splice(index,1);
          this.setState({vacancies: vacancies});
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }

  render() {
    var status = this.props.match.params.status;
    var vacancies = this.state.vacancies;
    return (
      <div>

        <div>
          <h4 className="mb-0 mt-2">Все удаленные вакансии</h4><br/>
          <div className="row">
            <div className="col-sm-7">
              <Link className="btn btn-outline-primary mb-3" to="/panel/common/vacancies/add">Создать вакансию</Link>
            </div>
            <div className="col-sm-5 statusActive">
              <ul className="nav nav-tabs mb-2 pull-right">
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === '1'} activeStyle={{color:"black"}} to="/panel/common/vacancies/active/1" replace>Активные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === '2'} activeStyle={{color:"black"}} to="/panel/common/vacancies/disable/2" replace>Отключенные</NavLink></li>
                <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link" isActive={(match, location) => status === 'all'} activeStyle={{color:"black"}} to="/panel/common/vacancies/trashed/all" replace>Удаленные</NavLink></li>
              </ul>
            </div>
          </div>
          {this.state.loaderHidden &&
          <table className="table">
            <thead>
            <tr>
              <th style={{width: '10%'}}>#</th>
              <th style={{width: '23%'}}>Название</th>
              <th style={{width: '33%'}}>Описание</th>
              <th style={{width: '20%'}}>Создано</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {vacancies.map(function(vacancy, index) {
              return(
                <tr key={index} style={{cursor: "pointer"}}>
                  <td onClick={this.showVacancy.bind(this,vacancy.id)}>{index + 1}</td>
                  <td onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.title}</td>
                  <td onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.description}</td>
                  <td title={'Обнавлено последний раз: ' + vacancy.updated_at} onClick={this.showVacancy.bind(this,vacancy.id)}>{vacancy.created_at}</td>
                  <td>
                    <button className="btn btn-outline-success" onClick={this.recoveryTheVacancy.bind(this,index)}><i className="glyphicon glyphicon-edit mr-2"></i> Востановить</button>
                  </td>
                </tr>
              );
            }.bind(this))
            }

            {vacancies.length === 0 &&
              <tr>
                <td colSpan="5">Пусто</td>
              </tr>
            }
            </tbody>
          </table>
          }
        </div>


        {!this.state.loaderHidden &&
        <div style={{textAlign: 'center'}}>
          <Loader type="Oval" color="#46B3F2" height="200" width="200" />
        </div>
        }
      </div>
    )
  }
}
class AddVacancy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: true,
      title : '',
      value: '',
      desc : '',
      content_ru: '',
      content_kk: ''
    };
    this.onChangeRU = this.onChangeRU.bind(this);
    this.onChangeKK = this.onChangeKK.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
    $('.note-popover').remove();
  }
  onChangeRU(content) {
    this.setState({content_ru: content})
  }
  onChangeKK(content) {
    this.setState({content_kk: content})
  }
  requestSubmission(e){
    e.preventDefault();
    let vacancy = new Object();
    vacancy.title = this.state.title;
    vacancy.description = this.state.desc;
    vacancy.content_ru = this.state.content_ru;
    vacancy.content_kk = this.state.content_kk;
    console.log(vacancy);
    let token = sessionStorage.getItem('tokenInfo');

    if (token) {
      this.setState({loaderHidden: false});
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/vacancies/insert", true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          alert(data.message);
          this.props.history.push('/panel/common/vacancies');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        } else if (xhr.status === 500) {
          alert("Ошибка, проверьте заполненность всех полей и пропробуйте еще раз!");
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send(JSON.stringify(vacancy));
    } else {
      sessionStorage.clear();
      alert("Время сессии истекло. Пожалуйста войдите заново!");
      this.props.history.push('/panel/common/login');
    }
  }

  render() {

    return (
      <div className="container">
        <br/>
        <div className="col-md-12">
          <form id="insert_form" name="form_aritcle">
            <div className="form-group">
              <label htmlFor="title">Название</label>
              <input type="text" name="title" maxLength="150" id="title" pleaceholder="Title" className="form-control"
                     required onChange={(e) => this.setState({title: e.target.value})}/>
            </div>
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <input type="text" name="description" maxLength="150" id="description" pleaceholder="Description"
                     className="form-control" required onChange={(e) => this.setState({desc: e.target.value})}/>
            </div>
            <div className="form-group">
              <label htmlFor="text">Содержание на русском</label>
              <ReactSummernote
                value={this.state.content_ru}
                options={{
                  // lang: 'ru-RU',
                  height: 350,
                  dialogsInBody: false,
                  toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']]
                  ]
                }}
                onChange={this.onChangeRU}
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Содержание страницы на казахском</label>
              <ReactSummernote
                value={this.state.content_kk}
                options={{
                  // lang: 'ru-RU',
                  height: 350,
                  dialogsInBody: false,
                  toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']]
                  ]
                }}
                onChange={this.onChangeKK}
              />
            </div>
            {this.state.loaderHidden &&
            <input type="submit" className="btn btn-outline-success" value="Отправить"
                   onClick={this.requestSubmission.bind(this)}/>
            }
            {!this.state.loaderHidden &&
            <div style={{textAlign: 'center'}}>
              <Loader type="Oval" color="#46B3F2" height="100" width="100" />
            </div>
            }
          </form>
          <div>
            <hr/>
            <Link className="btn btn-outline-secondary pull-right" id="back" to={'/panel/common/vacancies/'}><i
              className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
          </div>
        </div>
      </div>
    )
  }

}
class ShowVacancies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      title : '',
      value: '',
      desc : '',
      content_ru: '',
      content_kk: '',
      status : '',
      deleted_at : null
    };
    this.onChangeRU = this.onChangeRU.bind(this);
    this.onChangeKK = this.onChangeKK.bind(this);
  }
  componentDidMount() {
    this.props.breadCrumbs();
    $('.note-popover').remove();
  }
  componentWillMount() {
    this.getVacancy(this.props.match.params.id);
  }
  onChangeRU(content) {
    this.setState({content_ru: content})
  }
  onChangeKK(content) {
    this.setState({content_kk: content})
  }
  getVacancy(id) {
    let token = sessionStorage.getItem('tokenInfo');

    if (token) {
      this.setState({loaderHidden: false});
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/show/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          this.setState({title: data.vacancy.title});
          this.setState({desc: data.vacancy.description});
          this.setState({status: data.vacancy.status});
          this.setState({content_ru: data.vacancy.content_ru});
          this.setState({content_kk: data.vacancy.content_kk});
          this.setState({deleted_at: data.vacancy.deleted_at});

          this.setState({loaderHidden:true});
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        } else if (xhr.status === 500) {
          alert("Ошибка, проверьте заполненность всех полей и пропробуйте еще раз!");
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    } else {
      sessionStorage.clear();
      alert("Время сессии истекло. Пожалуйста войдите заново!");
      this.props.history.push('/panel/common/login');
    }
  }
  requestSubmission(){
    let vacancy = new Object();
    vacancy.title = this.state.title;
    vacancy.description = this.state.desc;
    vacancy.content_ru = this.state.content_ru;
    vacancy.content_kk = this.state.content_kk;
    console.log(vacancy);
    let token = sessionStorage.getItem('tokenInfo');

    if (token) {
      var xhr = new XMLHttpRequest();
      xhr.open("post", window.url + "api/vacancies/update/" + this.props.match.params.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          alert(data.message);
          this.props.history.push('/panel/common/vacancies');
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        } else if (xhr.status === 500) {
          alert("Ошибка, проверьте заполненность всех полей и пропробуйте еще раз!");
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send(JSON.stringify(vacancy));
    } else {
      sessionStorage.clear();
      alert("Время сессии истекло. Пожалуйста войдите заново!");
      this.props.history.push('/panel/common/login');
    }
  }
  deleteTheVacancy(id) {
    if (!window.confirm('Вы действительно хотите удалить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/delete/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  disableTheVacancy(id) {
    if (!window.confirm('Вы действительно хотите отключить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/disable/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  unDisableTheVacancy(id) {
    if (!window.confirm('Вы действительно хотите включить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/un-disable/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  recoveryTheVacancy(id) {
    if (!window.confirm('Вы действительно хотите востановить данную вакансию?')) {
      return false;
    }
    var token = sessionStorage.getItem('tokenInfo');
    if (token)
    {
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + "api/vacancies/recovery/" + id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let vacancies = this.state.vacancies;
          alert(data.message);
        } else if (xhr.status === 401) {
          sessionStorage.clear();
          alert("Время сессии истекло. Пожалуйста войдите заново!");
          this.props.history.push('/panel/common/login');
        }

        this.setState({ loaderHidden: true });
      }.bind(this);
      xhr.send();
    }
  }
  deleteWithSavingChanges() {
    this.deleteTheVacancy(this.props.match.params.id);
    this.requestSubmission();
    this.props.history.push('/panel/common/vacancies');
  }
  deleteWithOutSavingChanges() {
    this.deleteTheVacancy(this.props.match.params.id);
    this.props.history.push('/panel/common/vacancies');
  }
  disableWithSavingChanges() {
    this.disableTheVacancy(this.props.match.params.id);
    this.requestSubmission();
    this.props.history.push('/panel/common/vacancies');
  }
  disableWithOutSavingChanges() {
    this.disableTheVacancy(this.props.match.params.id);
    this.props.history.push('/panel/common/vacancies');
  }
  recoveryWithSavingChanges() {
    this.recoveryTheVacancy(this.props.match.params.id);
    this.requestSubmission();
    this.props.history.push('/panel/common/vacancies');
  }
  recoveryWithOutSavingChanges() {
    this.recoveryTheVacancy(this.props.match.params.id);
    this.props.history.push('/panel/common/vacancies');
  }
  unDisableWithSavingChanges() {
    this.unDisableTheVacancy(this.props.match.params.id);
    this.requestSubmission();
    this.props.history.push('/panel/common/vacancies');
  }
  unDisableWithOutSavingChanges() {
    this.unDisableTheVacancy(this.props.match.params.id);
    this.props.history.push('/panel/common/vacancies');
  }


  render() {

    return (
      <div className="container">
        <br/>

          <div className="col-md-12">
            <form id="insert_form" name="form_aritcle">
              <div className="form-group">
                <label htmlFor="title">Название</label>
                <input type="text" name="title" maxLength="150" id="title" pleaceholder="Title" className="form-control"
                       required onChange={(e) => this.setState({title: e.target.value})} value={this.state.title}/>
              </div>
              <div className="form-group">
                <label htmlFor="description">Описание</label>
                <input type="text" name="description" maxLength="150" id="description" pleaceholder="Description"
                       className="form-control" required onChange={(e) => this.setState({desc: e.target.value})} value={this.state.desc}/>
              </div>
              <div className="form-group">
                <label htmlFor="text">Содержание на русском</label>
                <ReactSummernote
                  value={this.state.content_ru}
                  options={{
                    // lang: 'ru-RU',
                    height: 350,
                    dialogsInBody: false,
                    toolbar: [
                      ['style', ['style']],
                      ['font', ['bold', 'underline', 'clear']],
                      ['fontname', ['fontname']],
                      ['para', ['ul', 'ol', 'paragraph']],
                      ['table', ['table']],
                      ['insert', ['link', 'picture', 'video']],
                      ['view', ['fullscreen', 'codeview']]
                    ]
                  }}
                  onChange={this.onChangeRU}
                />
              </div>
              <div className="form-group">
                <label htmlFor="text">Содержание страницы на казахском</label>
                <ReactSummernote
                  value={this.state.content_kk}
                  options={{
                    // lang: 'ru-RU',
                    height: 350,
                    dialogsInBody: false,
                    toolbar: [
                      ['style', ['style']],
                      ['font', ['bold', 'underline', 'clear']],
                      ['fontname', ['fontname']],
                      ['para', ['ul', 'ol', 'paragraph']],
                      ['table', ['table']],
                      ['insert', ['link', 'picture', 'video']],
                      ['view', ['fullscreen', 'codeview']]
                    ]
                  }}
                  onChange={this.onChangeKK}
                />
              </div>
              <div className={'row'}>
                <div className="btn-group col-md-3">
                  <button type="button" className="btn btn-outline-success"
                          onClick={this.requestSubmission.bind(this)}>Отправить</button>
                </div>
                <div className="col-md-5"></div>
                <div className="float-right col-md-4">
                  {this.state.status === 1 && this.state.deleted_at === null &&
                    <div className="btn-group">
                      <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown"
                              aria-haspopup="true" aria-expanded="false">
                        <i className="glyphicon glyphicon-off mr-2"></i>
                        Отключить
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={this.disableWithSavingChanges.bind(this)} >C сохранением изменении</button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={this.disableWithOutSavingChanges.bind(this)} >Без сохранение изменении</button>
                      </div>
                    </div>
                  }
                  {this.state.status === 2 && this.state.deleted_at === null &&
                    <div className="btn-group">
                      <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown"
                              aria-haspopup="true" aria-expanded="false">
                        <i className="glyphicon glyphicon-off mr-2"></i>
                        Включить
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={this.unDisableWithSavingChanges.bind(this)} >C сохранением изменении</button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={this.unDisableWithOutSavingChanges.bind(this)} >Без сохранение изменении</button>
                      </div>
                    </div>
                  }

                  {this.state.deleted_at === null &&
                    <div className="btn-group">
                      <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown"
                              aria-haspopup="true" aria-expanded="false">
                        <i className="glyphicon glyphicon-remove mr-2"></i>
                        Удалить
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={this.deleteWithSavingChanges.bind(this)} >C сохранением изменении</button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={this.deleteWithOutSavingChanges.bind(this)} >Без сохранение изменении</button>
                      </div>
                    </div>
                  }
                  {this.state.deleted_at !== null &&
                    <div className="btn-group">
                      <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown"
                              aria-haspopup="true" aria-expanded="false">
                        <i className="glyphicon glyphicon-edit mr-2"></i>
                        Востановить
                      </button>
                      <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={this.recoveryWithSavingChanges.bind(this)} >C сохранением изменении</button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={this.recoveryWithOutSavingChanges.bind(this)} >Без сохранение изменении</button>
                      </div>
                    </div>
                  }
                </div>
              </div>

            </form>
            <div>
              <hr/>
              <Link className="btn btn-outline-secondary pull-right" id="back" to={'/panel/common/vacancies/'}>
                <i className="glyphicon glyphicon-chevron-left"></i> Назад</Link>
            </div>
          </div>

      </div>
    )
  }

}
