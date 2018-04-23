import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class businessbuilding extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.businessbuilding}
                <div className="container pageBusinessbuilding">
                    <ul className="businessul">
                        <li><a target="_blank" href="/docs/zakonork.pdf">1) Закон РК О долевом участии в жилищном строительстве.</a></li>
                        <li><a target="_blank" href="/docs/standartgosusl.pdf">2) Стандарт государственной услуги Выдача разрешения на привлечение денег дольщиков.</a></li>
                        <li><a target="_blank" href="/docs/pravilavvedenia.pdf">3) Правила ведения учета местными исполнительными органами договоров о долевом участии в жилищном строительстве, а также договоров. о переуступке прав требований по ним.</a></li>
                        <li><a target="_blank" href="/docs/vydannyeraz.pdf">4) Выданные разрешения на привлечение денег дольщиков в г. Алматы</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}
