import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/NewsArticle.css';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';

let e = new LocalizedStrings({ru,kk});

export default class newsArticle extends React.Component{

  constructor() {
      super();
      (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

      this.state = {
          tokenExists: false,
          loaderHidden: false,
          article: []
      }

  }

  componentDidMount() {
       new WOW.WOW({
          live: false
      }).init();
      this.getNews();
    }

  getNews () {
      var link = 'api/news/article/' + this.props.match.params.id;
      var xhr = new XMLHttpRequest();
      xhr.open("get", window.url + link, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          console.log(data.article);
          data.article.created_at = data.article.created_at.substr(0,10);
          this.setState({article: data.article});
          this.setState({loaderHidden: true});
        } else {
          alert("Записи новостей не удалось найти в базе данных!");
        }
      }.bind(this);
      xhr.send();

  }

  render() {
    return(
      <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
        <div className="row col-md-12">
          {this.state.loaderHidden &&
          <div className="col-md-12 col-xs-12 black-main text-center">
            <h4>{this.state.article.title}</h4>
            <span><img src="images/line.png"/></span>
            <div className="card-deck news">

              <div className="card mt-4 mb-4 wow fadeInUp" data-wow-duration="1s">

                <div className="list-group">

                  <div href="#" className="list-group-item flex-column align-items-start ">
                    <div className="d-flex w-100 left-content-between">
                      <img className="news-icon" src="./images/clock-icon.png"
                           alt="Время выхода"/>
                      <p className="text-muted font-weight-light">Дата публикации: {this.state.article.created_at}</p>
                    </div>
                    <div className="d-flex w-100 left-content-between">
                      <button type="button" className="btn btn-warning btn-arrow-right disable">&nbsp;&nbsp;&nbsp;Рубрика&nbsp;&nbsp;
                      </button>
                      {this.state.article.heading_id === 1 &&
                        <button type="button" className="btn btn-primary btn-arrow-right disable">&nbsp;&nbsp;&nbsp;Новости управления
                          &nbsp;&nbsp;</button>
                      }
                      {this.state.article.heading_id === 2 &&
                        <button type="button" className="btn btn-primary btn-arrow-right disable">&nbsp;&nbsp;&nbsp;СМИ о нас
                          &nbsp;&nbsp;</button>
                      }
                      {this.state.article.heading_id === 3 &&
                        <button type="button" className="btn btn-primary btn-arrow-right disable">&nbsp;&nbsp;&nbsp;Кадры решают все
                          &nbsp;&nbsp;</button>
                      }

                    </div>

                    <div className="text-left mt-2 mb-1 innerText" id="innerText"
                       dangerouslySetInnerHTML={{__html: this.state.article.text}}>
                    </div>
                    <br/>
                    <div className="dropdown-divider"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
                <a className="allnews" href="/#/NewsAll"> Вернуться ко всем новостям</a>
            </div>
          </div>
          }
          {!this.state.loaderHidden &&
              <Loader/>
          }
        </div>
        <br/>
        <br/>
      </div>
    )
  }
}
