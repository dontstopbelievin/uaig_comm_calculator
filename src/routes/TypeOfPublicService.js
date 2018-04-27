import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class typeofpublicservice extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.typeofpublicservice}
                <div className="container menupage">
                    <ul className="menuUl">
                        <li><a target="_blank" href="#">1) Выдача справки по определению адреса объектов недвижимости.</a></li>
                        <li><a href="#">2) Выдача архитектурно-планировочного задания.</a></li>
                        <li><a target="_blank" href="#">3) Выдача решения на фотоотчет.</a></li>
                        <li><a target="_blank" href="#">4) Выдача решения о строительстве культовых зданий (сооружений), определении их месторасположения.</a></li>
                        <li><a target="_blank" href="#">5) Выдача решения о перепрофилировании (изменении функционального назначения) зданий (сооружений) в культовые здания (сооружения).</a></li>
                        <li><a target="_blank" href="#">6) Предоставление земельного участка для строительства объекта в черте населенного пункта.</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
