import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/newsAll.css';
import WOW from 'wowjs';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class newsByDay extends React.Component{

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
            news: []
        }

        this.getNews = this.getNews.bind(this);
    }

    componentDidMount() {
         new WOW.WOW({
            live: false
        }).init();
        this.getNews();
      }

    getNews () {
        var link = 'api/news/dayNews/'+this.props.match.params.date;
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

            this.setState({news: data.news});
          } else {
            alert("Записи новостей не удалось найти в базе данных!");
          }
        }.bind(this);
        xhr.send();

    }

    render() {
        return(

            <div className="container body-content">
                    <div className="row">
                        <div className="col-md-12 col-xs-12 black-main text-center">
                            <h4 >Все новости на {this.props.match.params.date}</h4>
                            <span><img src="/images/line.png" /></span>


                            <div className="card-deck news">

                                <div className="card mt-8 mb-8 wow fadeInLeft" data-wow-duration="1.5s">

                                    <div className="list-group">

                                        {this.state.news.map(function(article) {
                                            var link = '/#/NewsArticle/' + article.id;

                                            return(

                                        <div href="#" className="list-group-item flex-column align-items-start  wow fadeInDown"  data-wow-duration="1.5s">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="text-muted font-weight-light">{article.created_at}</p>
                                            </div>

                                            <h6 className="text-left text-muted mb-1">{article.title}</h6>
                                            <p className="text-left mt-2 mb-1">{article.description}</p>
                                            <div className="dropdown-divider"></div>
                                            <a href={link}><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>

                                            );

                                          }.bind(this))
                                        }





                                    </div>

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
