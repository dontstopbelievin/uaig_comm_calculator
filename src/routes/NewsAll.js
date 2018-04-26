import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/newsAll.css';
import WOW from 'wowjs';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class newsAll extends React.Component{

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
            
            <div className="container body-content">
                    <div className="row">
                        <div className="col-md-12 col-xs-12 black-main text-center">
                            <h4 >ВСЕ НОВОСТИ</h4>
                            <span><img src="/images/line.png" /></span>
                            
                            
                            <div className="card-deck news">
                                
                                <div className="card mt-4 mb-4 wow fadeInLeft" data-wow-duration="1.5s">

                                    <div className="list-group">
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>


                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <div className="card mt-4 mb-4 wow fadeInRight" data-wow-duration="1.5s">

                                    <div className="list-group">
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                      
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                        
                                        <div href="#" className="list-group-item flex-column align-items-start ">
                                            <div className="d-flex w-100 left-content-between">
                                                <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                <p className="news-date text-muted font-weight-light">15.01.2018</p>
                                            </div>
                                          
                                            <h6 className="news-title text-left text-muted mb-1">Преимущества и недостатки дисков</h6>
                                            <p className="news-text  text-left mt-2 mb-1">Дисковый затвор - вид запорной арматуры, который является запирающим элементом.Дисковый затвор - вид запорной арматуры, который является запирающим элементом. </p>
                                            <div className="dropdown-divider"></div>
                                            <a href="/#/NewsArticle"><small className="float-right text-warning view-more font-weight-bold">Читать далее</small></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
