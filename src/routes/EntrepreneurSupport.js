import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class entrepreneurialsupport extends React.Component{

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
            <div className="container navigational_price body-content">
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.entrepreneurialsupport}
                <div className="container menupage">
                    <ul className="menuUl">
                        <li><a target="_blank" href="https://business.gov.kz/ru/aspiring-entrepreneurs/">1) Помощь начинающему предпринимателю.</a></li>
                        <li><a target="_blank" href="https://damu.kz/programmi/programmy-dlya-nachinayushchikh-predprinimateley/detail.php?ELEMENT_ID=4654">2) Информация о субсидировании малого и среднего бизнеса .</a></li>
                        <li><a target="_blank" href="http://aral.gov.kz/ru/business/consultation_on_questions_of_business/">3) Консультирование по вопросам предпринимательства.</a></li>
                        <li><a target="_blank" href="https://damu.kz/dorozhnaya-karta-biznesa-2020/pressa-o-programme-dorozhnaya-karta-biznesa-2020/detail.php?ELEMENT_ID=4513">4) Информация о реализации программы «Дорожная карта бизнеса-2020».</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
