import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import '../assets/css/NewsArticle.css';
import WOW from 'wowjs';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class newsArticle extends React.Component{

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
            <div className="container body-content newsArticle wow fadeInUp" data-wow-duration="1s">
                                <div className="row col-md-12">
                                    <div className="col-md-12 col-xs-12 black-main text-center">
                                        <h4 >АВТОПРОБЕГ ЗАНЯТОСТИ</h4>
                                        <span><img src="images/line.png" /></span>
                                        
                                        
                                        <div className="card-deck news">
                                            
                                            <div className="card mt-4 mb-4 wow fadeInUp" data-wow-duration="1s">

                                                <div className="list-group">
                                                    
                                                      <div href="#" className="list-group-item flex-column align-items-start ">
                                                        <div className="d-flex w-100 left-content-between">
                                                            <img className="news-icon" src="./images/clock-icon.png" alt="Время выхода" />
                                                            <p className="text-muted font-weight-light">15.01.2018</p>
                                                        </div>

                                                        <p className="text-left mt-2 mb-1" >Сохранность пенсионных накоплений – один из ключевых вопросов, который  волнует всех казахстанцев.  Учитывая, что большинство сегодняшних вкладчиков  будут получать свои сбережения через десятки лет, опасения людей несложно понять.  К сожалению, именно  сомнения  по поводу сохранности своих вкладов являются главным аргументом тех наших сограждан,   которые   не торопятся делать   взносы для достойного обеспечения своей старости.   Между тем, многие просто не знают, что Казахстан является единственной страной в мире,  где существует государственная гарантия сохранности пенсионных накоплений граждан с учётом уровня инфляции на момент выхода на пенсию.Сохранность пенсионных накоплений – один из ключевых вопросов, который  волнует всех казахстанцев.  Учитывая, что большинство сегодняшних вкладчиков  будут получать свои сбережения через десятки лет, опасения людей несложно понять.  К сожалению, именно  сомнения  по поводу сохранности своих вкладов являются главным аргументом тех наших сограждан,   которые   не торопятся делать   взносы для достойного обеспечения своей старости.   Между тем, многие просто не знают, что Казахстан является единственной страной в мире,  где существует государственная гарантия сохранности пенсионных накоплений граждан с учётом уровня инфляции на момент выхода на пенсию.<br/><br/>Сохранность пенсионных накоплений – один из ключевых вопросов, который  волнует всех казахстанцев.  Учитывая, что большинство сегодняшних вкладчиков  будут получать свои сбережения через десятки лет, опасения людей несложно понять.  К сожалению, именно  сомнения  по поводу сохранности своих вкладов являются главным аргументом тех наших сограждан,   которые   не торопятся делать   взносы для достойного обеспечения своей старости.   Между тем, многие просто не знают, что Казахстан является единственной страной в мире,  где существует государственная гарантия сохранности пенсионных накоплений граждан с учётом уровня инфляции на момент выхода на пенсию. </p><br/>
                                                        <div className="dropdown-divider"></div>
                                                      </div>
                                                    
                                                </div>
                                            </div>
                                          
                                        </div>
                                        <div>
                                            <a className="allnews" href="/#/NewsAll"> Вернуться ко всем новостям</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
        )
    }
}
