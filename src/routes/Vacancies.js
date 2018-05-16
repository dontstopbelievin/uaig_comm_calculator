import React from 'react';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/vacancies.json';
//import $ from 'jquery';

let e = new LocalizedStrings({ru,kk});

export default class vacancies extends React.Component{

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
                <NavLink to="/" replace className="">{e.hometwo}</NavLink> / <NavLink to="/Staff"className="">{e.staffing}</NavLink> / {e.vacancies}
                <div container pageBusinessbuilding>
                    <ul className="content businessul">
                        <li>
                        <aside>
                            <p>24.04.2018</p>
                        </aside>
                        <article>
                                {localStorage.getItem('lang') === 'ru' &&
                                <a target="_blank" href="/docs/zhalpykonkursbasmamanru.pdf">
                                    1) Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантный административный корпус «Б». (Общий специалист)
                                </a>
                                }
                                {localStorage.getItem('lang') === 'kk' &&
                                <a target="_blank" href="/docs/zhalpykonkursbasmaman.pdf">
                                    1) Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман )
                                </a>
                                }

                        </article>
                        </li>
                            <li>
                                <aside>
                                    <p>24.04.2018</p>
                                </aside>
                                <article>
                                    {localStorage.getItem('lang') === 'ru' &&
                                    <a target="_blank" href="/docs/zhalpykonkursbasmamanapz_2inzhru.pdf">
                                        2) Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантную административную государственную должность «Б». (Общий специалист по соревнованиям APS-2)
                                    </a>
                                    }
                                    {localStorage.getItem('lang') === 'kk' &&
                                    <a target="_blank" href="/docs/zhalpykonkursbasmamanapz_2inzh.pdf">
                                        2) Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман АПЗ-2 инж )
                                    </a>
                                    }
                                </article>
                            </li>
                            <li>
                                <aside>
                                    <p>24.04.2018</p>
                                </aside>
                                <article>
                                    {localStorage.getItem('lang') === 'ru' &&
                                    <a target="_blank" href="/docs/zhalpykonkursbasmamanbostandykru.pdf">
                                        3) Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантный административный корпус «Б». (Общий специалист по конкуренции, Свобода Свободы)
                                    </a>
                                    }
                                    {localStorage.getItem('lang') === 'kk' &&
                                    <a target="_blank" href="/docs/zhalpykonkursbasmamanbostandyk.pdf">
                                        3) Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман Бостандық )
                                    </a>
                                    }
                                </article>
                            </li>
                            <li>
                                <aside>
                                    <p>5.05.2018</p>
                                </aside>
                                <article>
                                    {localStorage.getItem('lang') === 'ru' &&
                                    <a target="_blank" href="/docs/10mayrus.pdf">
                                        4) Список кандидатов на занатия вакантных административных государственных должностей корпуса «Б» допущенных к собеседованию которое будет проводиться 10 мая 2018 года в 10.00ч. (Абылай хана 91 каб. 707)
                                    </a>
                                    }
                                    {localStorage.getItem('lang') === 'kk' &&
                                    <a target="_blank" href="/docs/10maykaz.pdf">
                                        4) 2018 жылғы 10 мамыр күні сағат 10:00 де өтетін (Абылай хан даңғылы 91, 707 бөлме ) «Б» корпусынының бос лауазымдарына орналасу үшін  әңгімелесуге жіберілген кандидаттардың тізімі
                                    </a>
                                    }
                                </article>
                            </li>
                    </ul>
                </div>
            </div>
        )
    }
}