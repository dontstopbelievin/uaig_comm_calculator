import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/vacancies.json';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU';
import WOW from 'wowjs';

let e = new LocalizedStrings({ru,kk});

export default class VacanciesView extends React.Component{

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
              <Route path="/guest/vacancies-view/all" exact render={(props) =>(
                <AllVacanciesView {...props} />
              )} />
              <Route path="/guest/vacancies-view/show/:id" exact render={(props) =>(
                <ShowVacancy {...props} />
              )} />
              <Redirect from="/guest/vacancies-view" to="/guest/vacancies-view/all" />
            </Switch>
          </div>
        </div>

      </div>
    )
  }
}

class AllVacanciesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderHidden: false,
      vacancies: []
    };

  }
  componentDidMount() {
    this.getVacancies();
  }
  getVacancies() {
    this.setState({ loaderHidden: false });
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/guest/vacancies/all", true);
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
  showVacancy(id) {
    this.props.history.push('/guest/vacancies-view/show/' + id);
  }

  render() {
    var vacancies = this.state.vacancies;
    var lang = localStorage.getItem('lang');
    return (
      <div>
        <div className="col-md-12 col-xs-12 black-main text-center">
          <h4 >{(lang === 'ru') ? 'Все вакансии':'Барлық бос жұмыс орындар'}</h4>
          <span><img src="images/line.png" /></span>
        </div>

        <div>

          {this.state.loaderHidden &&
          <div>
            {vacancies.map(function (vacancy,index) {
              return (
                <div className="row">
                  <div className="col-md-1"></div>
                  <div href="#" className="list-group-item col-md-10 flex-column align-items-start  wow fadeInDown"
                       data-wow-duration="1.5s">
                    <div className="d-flex w-100 left-content-between">
                      <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода"/>
                      <p className="news-date text-muted font-weight-light" style={{padding:"3px 5px"}}>{vacancy.created_at.slice(0,10,'')}</p>
                    </div>

                    <h5 className="vacancy-title text-left text-secondary mb-1">{(lang === 'ru') ? vacancy.title_ru:vacancy.title_kk}</h5>
                    <p className="news-text text-left mt-2 mb-1">{(lang === 'ru') ? vacancy.description_ru:vacancy.description_kk}</p>
                    <div className="dropdown-divider"></div>
                    <div onClick={this.showVacancy.bind(this,vacancy.id)} style={{cursor:"pointer"}} className={'text-center col-md-12'}>
                      <small className="float-right text-warning view-more font-weight-bold">{(lang === 'ru' ) ? 'Читать далее':'Анықтап қарау'}</small>
                    </div>
                    <br />
                    <hr />
                  </div>
                </div>
              );

            }.bind(this))
            }
          </div>
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
class ShowVacancy extends React.Component {
  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      loaderHidden: false,
      vacancy: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.getVacancy(nextProps.match.params.id);
    }
  }
  componentDidMount() {
    new WOW.WOW({
      live: false
    }).init();

    this.getVacancy(this.props.match.params.id);
  }
  componentWillMount () {
  }
  getVacancy (id) {
    var link = '/api/guest/vacancies/show/' + id;
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        this.setState({vacancy: data.vacancy});
        this.setState({loaderHidden: true});
        var lang = localStorage.getItem('lang');
        let str = '';
        var d1 = document.getElementById('innerText');
        var child = document.getElementById('must-delete');
        var throwaway = d1.removeChild(child);

        if (lang === 'kk')
        {
          str = this.state.vacancy.content_kk;
        }else if (lang === 'ru') {
          str = this.state.vacancy.content_ru;
        }

        var re = /&lt;/gi;
        var newstr = str.replace(re, '<');
        console.log(newstr);
        console.log('_______________');
        var me = /&gt;/gi;
        var str1  = newstr.replace(me,'>');
        console.log(str1);
        console.log('_______________');
        var te = /&quot;/gi;
        var str2  = str1.replace(te,'"');
        console.log(str2);
        str2 = '<div id="must-delete">'+ str2 + '</div>';

        var d1 = document.getElementById('innerText');
        d1.insertAdjacentHTML( 'afterBegin', str2 );
      } else {
        alert("Страница не найдена!");
        this.props.history.replace('/');
      }
    }.bind(this);
    xhr.send();
  }

  render() {
    var lang = localStorage.getItem('lang');
    return(
      <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
        <div className="row col-md-12">
          {this.state.loaderHidden &&
          <div className="col-md-12"><br/>
            <h4>{(lang === 'ru') ? this.state.vacancy.title_ru : this.state.vacancy.title_kk}</h4>
            <span><img src="images/line.png" /></span>
            <div className="list-group-item flex-column align-items-start ">
              <div className="text-left container" id="innerText">
                <div id="must-delete"></div>
                <div className="col-md-12 text-center">
                  <br/>
                  <br/>
                  <br/>
                  <hr style={{height:"1px"}}/>
                  <a className="allnews" href="/#/" onClick={this.props.history.goBack}>{(lang === 'ru') ? 'Вернуться':'Артқа қайту'}</a>
                </div>
              </div>
              <br/>
            </div>

          </div>
          }
          {!this.state.loaderHidden &&
          <div className={'row col-md-12'}>
            <div className={'col-md-5'}></div>
            <Loader type="Oval" color="#46B3F2" height="200" width="200"/>
            <div className={'col-md-4'}></div>
          </div>
          }
        </div>
        <br/>
        <br/>
      </div>
    )
  }
}