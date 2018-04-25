import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class executiveagency extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.executiveagency}
                <div className="container menupage">
                    <ul className="menuUl">
                        <li><a target="_blank" href="https://almaty.gov.kz/page.php?page_id=3239&lang=1">1) Программа развития территории(Алматы-2020).</a></li>
                        <li><a target="_blank" href="http://egov.kz/cms/ru/articles/program_kz">2) Государственные отраслевые программы.</a></li>
                        <li><a target="_blank" href="http://economy.gov.kz/ru/kategorii/itogi-socialno-ekonomicheskogo-razvitiya-regionov?theme_version=standart">3) Итоги социально-экономического развития региона по отраслям.</a></li>
                        <li><a target="_blank" href="http://bko.gov.kz/ru/power/gerlt-atarashi-organarchy-kyzmeti-timign-balau-oriental.html">4) Отчеты акима о деятельности местных исполнительных органов.</a></li>
                        <li><a target="_blank" href="http://zhetysu.gov.kz/ru/content/deyatelnost-sovetov-i-komissiy/">5) Информация о деятельности КСО.</a></li>
                        <li><a target="_blank" href="#">6) Итоги оценки эффективности деятельности местного исполнительного органа.</a></li>
                        <li><a target="_blank" href="http://economy.gov.kz/ru/kategorii/zakonodatelnye-akty-rk-po-voprosam-perehoda-k-zelenoy-ekonomike">7) Законодательные акты РК по вопросам перехода  к «Зеленой экономике».</a></li>
                        <li><a target="_blank" href="#">8) Информация о деятельности местного исполнительного органа по реализации мер по переходу Республики Казахстан к «зеленой экономике».</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
