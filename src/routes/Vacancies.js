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
                  <p>20.06.2018</p>
                </aside>
                <article>
                  {localStorage.getItem('lang') === 'ru' &&
                    <a target="_blank" href="/docs/obshh_konkurs_na_glavnogo_specialista_auezov.doc">
                      Управление архитектуры и градостроительства города Алматы объявляет общий конкурс на занятие вакантной административной государственной должности корпуса «Б» (Главный специалист отдела архитектуры и градостроительства по Ауезовскому району)
                    </a>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <a target="_blank" href="/docs/zhalpy_konkurs_bas_maman_auezov.doc">
                      Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды (Әуезов аудандық сәулет және қала құрылысы бөлімінің бас маманы)
                    </a>
                  }
                </article>
              </li>

              <li>
                <aside>
                  <p>20.06.2018</p>
                </aside>
                <article>
                  {localStorage.getItem('lang') === 'ru' &&
                    <a target="_blank" href="/docs/obshh_konkurs_na_glavnogo_specialista_apz.doc">
                      Управление архитектуры и градостроительства города Алматы объявляет общий конкурс на занятие вакантной административной государственной должности корпуса «Б» (Главный специалист отдела по подготовке архитектурно планировочного задания и согласования проектов)
                    </a>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <a target="_blank" href="/docs/zhalpy_konkurs_bas_maman_apz.doc">
                      Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды (Сәулет жоспарлау тапсырмасын дайындау және жобаларды келісу бөлімінің бас маманы)
                    </a>
                  }
                </article>
              </li>

              <li>
                <aside>
                  <p>05.05.2018</p>
                </aside>
                <article>
                  {localStorage.getItem('lang') === 'ru' &&
                    <a target="_blank" href="/docs/10mayrus.pdf">
                      Список кандидатов на занатия вакантных административных государственных должностей корпуса «Б» допущенных к собеседованию которое будет проводиться 10 мая 2018 года в 10.00ч. (Абылай хана 91 каб. 707)
                    </a>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <a target="_blank" href="/docs/10maykaz.pdf">
                      2018 жылғы 10 мамыр күні сағат 10:00 де өтетін (Абылай хан даңғылы 91, 707 бөлме ) «Б» корпусынының бос лауазымдарына орналасу үшін  әңгімелесуге жіберілген кандидаттардың тізімі
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
                    <a target="_blank" href="/docs/zhalpykonkursbasmamanru.pdf">
                      Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантный административный корпус «Б». (Общий специалист)
                    </a>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <a target="_blank" href="/docs/zhalpykonkursbasmaman.pdf">
                      Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман )
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
                      Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантную административную государственную должность «Б». (Общий специалист по соревнованиям APS-2)
                    </a>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <a target="_blank" href="/docs/zhalpykonkursbasmamanapz_2inzh.pdf">
                      Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман АПЗ-2 инж )
                    </a>
                  }
                  {localStorage.getItem('lang') === 'ru' &&
                    <div className="busy">
                     <p>По состоянию на 11 мая 2018 года по решению заключительной заседаний конкурсной комиссии Управления архитектуры и градостроительства города Алматы для занятия вакантной административной государственной должности –главного специалиста отдела по подготовке архитектурно- планировочного задания принята кандидатура Дуйсебека Бауыржана.</p>
                    </div>
                  }
                  {localStorage.getItem('lang') === 'kk' &&
                    <div className="busy">
                      <p>2018 жылғы 11 мамырдағы Алматы қаласы Сәулет және қала құрылысы басқармасының конкурстық комиссиясының қорытынды отырысының шешімімен сәулет жоспарлау тапсырмасын дайындау және жобаларды келісу бөлімінің бас маманы лауазымына Дүйсебек Бауыржан қабылданды.</p>
                    </div>
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
                    Управление архитектуры и градостроительства города Алматы объявляет конкурс на вакантный административный корпус «Б». (Общий специалист по конкуренции, Свобода Свободы)
                  </a>
                }
                {localStorage.getItem('lang') === 'kk' &&
                  <a target="_blank" href="/docs/zhalpykonkursbasmamanbostandyk.pdf">
                    Алматы қаласы Сәулет және қала құрылысы басқармасы «Б» корпусының бос мемлекеттік әкімшілік лауазымына орналасуға жалпы конкурс жариялайды. (Жалпы конкурс бас маман Бостандық )
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