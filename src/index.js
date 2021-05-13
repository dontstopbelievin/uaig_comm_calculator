import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { routes } from './routes';
import './imports/styles';
import './imports/js';
import LocalizedStrings from 'react-localization';
import { ru, kk } from './languages/breadCrumbs.json';
import { Redirect } from 'react-router-dom';

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
    }

    forceUpdatePage() {
        this.forceUpdate();
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div className="container body-content">
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
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));