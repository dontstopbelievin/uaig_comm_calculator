import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Header from './components/Header';
import { routes } from './routes';
import Footer from './components/Footer';
import './imports/styles';
import './imports/js';
import LocalizedStrings from 'react-localization';
import { ru, kk } from './languages/breadCrumbs.json';
import { Redirect } from 'react-router-dom';
import { KeepSession } from "./routes/authorization";

let e = new LocalizedStrings({ ru, kk });

export default class Main extends React.Component {
    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');
    }

    setLang() {
        return localStorage.getItem('lang') ? true : localStorage.setItem('lang', 'ru');
    }

    componentWillMount() {
        this.setLang();

        window.url = 'https://api.uaig.kz:8843/';
        // window.url = 'http://api.uaig.kz:8880/';
        // window.url = 'http://192.168.0.231/';
        // window.url = 'http://shymkentback.uaig.kz/';
        window.clientSecret = 'bQ9kWmn3Fq51D6bfh7pLkuju0zYqTELQnzeKuQM4'; // SERVER

        // window.url = 'http://uaig/';
        // window.url = 'http://uaig.local/';
        //window.clientSecret = 'cYwXsxzsXtmca6BfALhYtDfGXIQy3PxdXIhY9ZxP'; // dimash
        //window.clientSecret = 'G0TMZKoKPW4hXZ9hXUCfq7KYxENEqB6AaQgzmIt9'; // zhalgas
        // window.clientSecret = 'fuckaduckmotherfucker'; // aman
        // window.clientSecret = 'saJNJSmE3nUg22fThaUuQfCChKFeYjLE8cscRTfu'; // taiyr
        // window.clientSecret = '7zdU2XDblqORFq8wbQHlNRaIgEBR90qbMYnnVWDg'; // yernar
        // window.clientSecret = 'TPzBTua5JvfgKAnhQiThXu03DWSh1xyiZ9T8VHDn'; // medet
    }

    forceUpdatePage() {
        this.forceUpdate();
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route render={(props) => (<KeepSession forceUpdatePage={this.forceUpdatePage.bind(this)} {...props} />)} />
                    <Route render={(props) => (<Header {...props} />)} />
                    <div className="container body-content">
                        <Link className="active my_font_size" to='/panel/base-page'>{e['electron-architecture']}</Link>
                        <div className="container navigational_price" id={'breadCrumbs'}></div>
                        <div className="content container citizen-apz-list-page">
                            <div>
                                <div>
                                    <Switch>
                                        {routes.map((route, index) => <Route key={index} {...route} />)}
                                        <Redirect from="/" to="/panel/base-page" />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));