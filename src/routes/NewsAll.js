import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/newsAll.css';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import WOW from 'wowjs';
//import $ from 'jquery';
import Loader from 'react-loader-spinner';

let e = new LocalizedStrings({ru,kk});

export default class newsAll extends React.Component{

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
        };
    }


    render() {
        return(
            
            <div className="container body-content">
                    <div className="row">
                        <div className="col-md-12 col-xs-12 black-main text-center">
                            <h4 >ВСЕ НОВОСТИ</h4>
                            <span><img src="/images/line.png" /></span>
                            

                                <div className="card mt-8 mb-8 wow fadeInLeft" data-wow-duration="1.5s">

                                    <div className="list-group">
                                        <Switch>
                                          <Route path="/newsAll/status/:status" component={AllNews} />
                                          <Redirect from="/newsAll" to="/newsAll/status/1" />
                                        </Switch>
                                    </div>

                                </div>
                        </div>
                    </div>
                    <br/>
                    <br/>
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
         new WOW.WOW({
            live: false
        }).init();
        this.getNews();
      }


    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.status !== nextProps.match.params.status) {
          this.getNews(nextProps.match.params.status);
        }
      }

    getNews (status = null) {

        if (!status) {
          status = this.props.match.params.status;
          console.log(status);
        }
        var link = 'api/news/all';
        var xhr = new XMLHttpRequest();
        xhr.open("get", window.url + link, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data.news);
            var x = data.news.length;

            for (var i = 0; i < x ; i ++ ){
                data.news[i].created_at = data.news[i].created_at.substr(0,10);
            }
            var news = '';
            switch (status) {
              case '1':
                news = data.news.filter(function(obj) { return obj.heading_id === 1 });
                break;

              case '2':
                news = data.news.filter(function(obj) { return obj.heading_id === 2; });
                break;

              case '3':
                news = data.news.filter(function(obj) { return obj.heading_id === 3; });
                break;

              default:
                news = data.news;
                break;
            }

            this.setState({news: news});
            this.setState({loaderHidden: true});
          } else {
            alert("Записи новостей не удалось найти в базе данных!");
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

              <div className="col-sm-5 statusActive">
                <ul className="nav nav-tabs mb-2 pull-right">
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link"  to="/newsAll/status/1" replace>Новости управления</NavLink></li>
                  <li className="nav-item"><NavLink exact activeClassName="nav-link active" className="nav-link"  to="/newsAll/status/2" replace>СМИ о нас</NavLink></li>
                  <li className="nav-item"><NavLink activeClassName="nav-link active" className="nav-link"  to="/newsAll/status/3" replace>Кадры решают все</NavLink></li>
                </ul>
              </div>
            </div>
                {this.state.news.map(function (article) {
                  var link = '/#/NewsArticle/' + article.id;
                  return (
                    <div className="row">
                      <div className="col-md-1"></div>
                      <div href="#" className="list-group-item col-md-10 flex-column align-items-start  wow fadeInDown"
                           data-wow-duration="1.5s">
                        <div className="d-flex w-100 left-content-between">
                          <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода"/>
                          <p className="news-date text-muted font-weight-light">{article.created_at}</p>
                        </div>

                        <h6 className="news-title text-left text-muted mb-1">{article.title}</h6>
                        <p className="news-text text-left mt-2 mb-1">{article.description}</p>
                        <div className="dropdown-divider"></div>
                        <a href={link}>
                          <small className="float-right text-warning view-more font-weight-bold">Читать далее</small>
                        </a>
                        <br />
                        <hr />
                      </div>
                    </div>
                  );

                }.bind(this))
                }
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
