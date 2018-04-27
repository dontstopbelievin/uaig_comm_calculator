import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class population extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.population}
                <div className="container menupage">
                    <ul className="menuUl">
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/kategorii/informaciya-o-postupivshih-obrashcheniyah-fizicheskih-i-yuridicheskih-lic">1) Информация о поступивших обращениях физических и юридических лиц.</a></li>
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/pages/zakon-respubliki-kazahstan-o-poryadke-rassmotreniya-obrashcheniy-fizicheskih-i-yuridicheskih-0">2) О порядке рассмотрения обращений физических и юридических лиц.</a></li>
                        <li><a target="_blank" href="#">3) Данные об опросах населения, обобщение и анализ запросов на получение информации, ответы на часто задаваемые вопросы, интернет-приемная и др.</a></li>
                        <li><a target="_blank" href="http://egov.kz/cms/ru/services/citizen_and_the_government/e_app">4) Подача электронных обращений через портал "электронного правительства".</a></li>
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/pages/poryadok-obzhalovaniya-resheniy-prinyatyh-po-rezultatam-rassmotreniya-obrashcheniy-kontaktnye">5) Порядок обжалования решений, принятых по результатам рассмотрения обращений, контактные данные ответственных лиц.</a></li>
                        <li><a target="_blank" href="http://adilet.zan.kz/rus/docs/V070004959_#z63">6) Нормативные правовые акты, регламентирующие порядок приема граждан.</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
