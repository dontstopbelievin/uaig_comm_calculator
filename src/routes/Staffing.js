import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class staffing extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.staffing}
                <div className="container menupage">
                    <ul className="menuUl">
                        <li><a target="_blank" href="http://economy.gov.kz/ru/kategorii/normativno-pravovye-akty-reguliruyushchie-poryadok-postupleniya-grazhdan-na">1) Нормативные правовые акты, регулирующие порядок поступления граждан на государственную службу.</a></li>
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/kategorii/konkursy-na-vakantnye-dolzhnosti">2) Сведения о вакантных должностях в государственном органе.</a></li>
                        <li><a target="_blank" href="http://www.kremzk.gov.kz/rus/menu2/kadr_politika/konsult/">3) Лица, уполномоченные консультировать по вопросам замещения вакантных должностей.</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
