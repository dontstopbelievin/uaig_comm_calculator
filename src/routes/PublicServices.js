import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class PublicServices extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.PublicServices}
                <div className="container pagePublicServices">
                    <ul className="PublicServicesul">
                        <li><a target="_blank" href="http://www.akorda.kz/ru/addresses">1) Ежегодные послания Президента РК.</a></li>
                        <li><a target="_blank" href="http://www.adilet.gov.kz/ru/taxonomy/term/3022">2) Планы мероприятий по реализации ежегодных посланий Главы государства.</a></li>
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/pages/informaciya-o-hode-realizacii-plana-meropriyatiy-po-realizacii-ezhegodnogo-poslaniya-glavy">3) Информация о ходе реализации Плана мероприятий по реализации ежегодного послания Главы государства.</a></li>
                        <li><a target="_blank" href="http://www.blogs.e.gov.kz">4) Персональный блог (веб-дневник) руководителей местных исполнительных органов.</a></li>
                        <li><a target="_blank" href="http://akmo.gov.kz/page/read/Informaciya_o_formirovanii_i_ukreplenii_pozitivnogo_imidzha_gosudarstvennoj_sluzhby_menu.html?lang=ru">5) Информация о формировании и укрепления позитивного имиджа гос.службы, о кодексе чести гос.служащих РК.</a></li>
                        <li><a target="_blank" href="http://www.adilet.gov.kz/ru/node/52580">6) Правила служебной этики гос.служащих.</a></li>
                        <li><a target="_blank" href="http://kyzmet.gov.kz/ru/kategorii/antikorrupcionnaya-strategiya-respubliki-kazahstan-na-2015-2025-gody">7) Информация о принимаемых мерах по противодействию коррупции.</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
