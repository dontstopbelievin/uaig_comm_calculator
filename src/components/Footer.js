import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import { YMInitializer } from 'react-yandex-metrika';

let e = new LocalizedStrings({ru,kk});

export default class Footer extends React.Component {
    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');
    }
    render(){
        var _zero_kz_ = [];
        _zero_kz_.push(["id", 70316]);
        _zero_kz_.push(["type", 1]);

        (function () {
            var a = document.getElementsByTagName("script")[0],
                s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = (document.location.protocol === "https:" ? "https:" : "http:")
                + "//c.zero.kz/z.js";
            a.parentNode.insertBefore(s, a);
        })();

        return(
            <div className="footer">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row">
                            <div className="copyright col-md-7">
                                <p className="mt-2 mb-2 text-white font-weight-bold">© 2017 - {e.kgu} "{e.title}"</p>
                            </div>

                            <div className="social col-md-5 text-right">
                                <a href="https://www.facebook.com/uaig.almaty.3"><img src="/images/facebook.png" alt="facebook" /></a>
                                <a href="https://www.instagram.com/uaigalmatykz/"><img src="/images/instagram.png" alt="instagram" /></a>
                                <a href="https://vk.com/id485151219"><img src="/images/vk.png" alt="vk" /></a>
                                <a href="https://twitter.com/?logged_out=1&lang=ru"><img src="/images/twitter.png" alt="twitter" /></a>
                                <a href="https://www.youtube.com/channel/UCCWoXvhrVkN1NAd6IQLghdQ"><img src="/images/youtube.png" alt="youtube" /></a>
                            </div>
                            <div className="email col-md-12" >
                                <a><img src="/images/email.png" alt="contact" /><b>u.aig@almaty.gov.kz</b></a>
                            </div>
                            <div className="address col-md-9">
                                <p><img src="/images/maps.png" alt="map" />Алматы пр. Абая, 90</p>
                            </div>
                            <div className="col-md-2 text-right">
                                <span id="_zero_70316">
                                    <a href="https://zero.kz/catalog/70316_upravlenie-arxitekturi-i-gradostroitelstva-goroda-almati" target="_blank" rel="noopener noreferrer">
                                        <img src="https://c.zero.kz/z.png?u=70316" width="88" height="31" alt="ZERO.kz" />
                                    </a>
                                    <a href="https://metrika.yandex.ru/dashboard?id=49388944" target="_blank" rel="noopener noreferrer">
                                        Статистика посещений
                                    </a>
                                </span>

                                <YMInitializer accounts={[49388944]} />
                            </div>
                            <div className="contact col-md-8 text-left font-weight-bold">
                                <p className="text-white"><img src="/images/phone-call.png" alt=""/>Проблемы с сайтом: <b className="underline"> +7 (707) 429-55-39</b></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
