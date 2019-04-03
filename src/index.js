import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Header from './components/Header';
import Login from './routes/authorization/Login';
import Register from './routes/authorization/Register';
import CitizenAllSketch from './routes/sketch/citizen/AllSketch';
import CitizenShowSketch from './routes/sketch/citizen/ShowSketch';
import CitizenAddSketch from './routes/sketch/citizen/AddSketch';
import Footer from './components/Footer';
import EditPersonalData from './routes/authorization/EditPersonalData';
import EditPassword from './routes/authorization/EditPassword';
import ForgotPassword from './routes/authorization/ForgotPassword';
import ResetForm from './routes/authorization/ResetForm';
import FirstLogin from "./routes/authorization/FirstLogin";
import UrbanAllSketch from "./routes/sketch/urban/AllSketch";
import UrbanShowSketch from "./routes/sketch/urban/ShowSketch";
import './imports/styles';
import './imports/js';
import LocalizedStrings from 'react-localization';
import {ru, kk} from './languages/breadCrumbs.json';
import { Redirect } from 'react-router-dom';

import BasePagePanel from "./routes/BasePagePanel";
import EngineerAllSketch from "./routes/sketch/engineer/AllSketch";
import EngineerShowSketch from "./routes/sketch/engineer/ShowSketch";
import HeadAllSketches from "./routes/sketch/head/AllSketches";
import HeadShowSketch from "./routes/sketch/head/ShowSketch";
import ExportToExcel from "./routes/apz/components/ExportToExcel";
import UrbanAllApzs from "./routes/apz/urban/AllApzs";
import UrbanShowApz from "./routes/apz/urban/ShowApz";
import AllTemplates from "./routes/reject_templates/AllTemplates";
import AddTemplate from "./routes/reject_templates/AddTemplate";
import ShowTemplate from "./routes/reject_templates/ShowTemplate";
import EngineerAllApzs from "./routes/apz/engineer/AllApzs";
import EngineerShowApz from "./routes/apz/engineer/ShowApz";
import EngineerEditApz from "./routes/apz/engineer/UpdateApz";
import StateServicesAllApzs from "./routes/apz/state_services/AllApzs";
import StateServicesShowApz from "./routes/apz/state_services/ShowApz";
import HeadAllApzs from "./routes/apz/head/AllApzs";
import HeadShowApz from "./routes/apz/head/ShowApz";
import ProviderElectroAllApzs from "./routes/apz/provider_electro/AllApzs";
import ProviderElectroShowApz from "./routes/apz/provider_electro/ShowApz";
import ProviderGasAllApzs from "./routes/apz/provider_gas/AllApzs";
import ProviderGasShowApz from "./routes/apz/provider_gas/ShowApz";
import ProviderHeatAllApzs from "./routes/apz/provider_heat/AllApzs";
import ProviderHeatShowApz from "./routes/apz/provider_heat/ShowApz";
import ProviderPhoneAllApzs from "./routes/apz/provider_phone/AllApzs";
import ProviderPhoneShowApz from "./routes/apz/provider_phone/ShowApz";
import ProviderWaterAllApzs from "./routes/apz/provider_water/AllApzs";
import ProviderWaterShowApz from "./routes/apz/provider_water/ShowApz";
import AdminAllApzs from "./routes/admin/AllApzs";
import AdminShowApz from "./routes/admin/ShowApz";
import AdminUpdateApz from "./routes/admin/UpdateApz";
import Admin from './routes/admin/Admin';
import AddUsers from "./routes/admin/AddUsers";
import OfficeAllApzs from "./routes/office/AllApzs";
import OfficeShowApz from "./routes/office/ShowApz";
import FilesAll from "./routes/files/AllFiles";
import FilesImages from "./routes/files/Images";
import CitizenAllApzs from "./routes/apz/citizen/AllApzs";
import CitizenAddApz from "./routes/apz/citizen/AddApz";
import CitizenShowApz from "./routes/apz/citizen/ShowApz";
import Actions from "./routes/Actions";
import LawyerAllApzs from "./routes/apz/lawyer/AllApzs";
import LawyerShowApz from "./routes/apz/lawyer/ShowApz";
import GenPlanAllApzs from "./routes/apz/gen_plan/AllApzs";
import GenPlanShowApz from "./routes/apz/gen_plan/ShowApz";
import GenPlanSchemeAllApzs from "./routes/apz/gen_plan_scheme/AllApzs";
import GenPlanSchemeShowApz from "./routes/apz/gen_plan_scheme/ShowApz";
import GenPlanHeadAllApzs from "./routes/apz/gen_plan_head/AllApzs";
import GenPlanHeadShowApz from "./routes/apz/gen_plan_head/ShowApz";
import GenPlanCalculationAllApzs from "./routes/apz/gen_plan_calculation/AllApzs";
import GenPlanCalculationShowApz from "./routes/apz/gen_plan_calculation/ShowApz";
import HeadStateServicesAllApzs from "./routes/apz/state_services_head/AllApzs";
import HeadStateServicesShowApz from "./routes/apz/state_services_head/ShowApz";
import SchemeRoadAllApzs from "./routes/apz/scheme_road/AllApzs";
import SchemeRoadShowApz from "./routes/apz/scheme_road/ShowApz";
import SchemeRoadHeadAllApzs from "./routes/apz/scheme_road_head/AllApzs";
import SchemeRoadHeadShowApz from "./routes/apz/scheme_road_head/ShowApz";
import AllApzsHistory from "./routes/apz/components/AllApzsHistory";
import KeepSession from "./routes/authorization/KeepSession";

let e = new LocalizedStrings({ru,kk});

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

        // window.url = 'https://api.uaig.kz:8843/';
        // window.url = 'http://api.uaig.kz:8880/';
        // window.url = 'http://192.168.0.231/';
        // window.url = 'http://shymkentback.uaig.kz/';
        // window.clientSecret = 'bQ9kWmn3Fq51D6bfh7pLkuju0zYqTELQnzeKuQM4'; // SERVER

        window.url = 'http://uaig/';
        //window.clientSecret = 'cYwXsxzsXtmca6BfALhYtDfGXIQy3PxdXIhY9ZxP'; // dimash
        //window.clientSecret = 'G0TMZKoKPW4hXZ9hXUCfq7KYxENEqB6AaQgzmIt9'; // zhalgas
        // window.clientSecret = 'fuckaduckmotherfucker'; // aman
        window.clientSecret = 'saJNJSmE3nUg22fThaUuQfCChKFeYjLE8cscRTfu'; // taiyr
        // window.clientSecret = '7zdU2XDblqORFq8wbQHlNRaIgEBR90qbMYnnVWDg'; // yernar
        // window.clientSecret = 'ZuW3nP8EUgXgEAqm6j9GxzBfFsOFuQv39NcyHUz3'; // medet
    }

    breadCrumbs() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        let fullLoc = window.location.href.split('/');
        let breadCrumbs = document.getElementById('breadCrumbs');
        breadCrumbs.innerHTML = "";

        // if (fullLoc[3] === 'panel')
        // {
        //     if ( typeof fullLoc[4] !== 'undefined' && typeof fullLoc[5] === 'undefined' )
        //     {
        //         let secondElem = document.createElement('span');
        //         secondElem.innerHTML = ' <span style="color:#e0b431;font-weight: bold;font-size:14px;">></span> ' +
        //             '<span style="font-weight: bold;">' + e[fullLoc[4]] + '</span> ';
        //         breadCrumbs.appendChild(secondElem);
        //
        //     }else if (typeof fullLoc[4] !== 'undefined' && typeof fullLoc[5] !== 'undefined')
        //     {
        //         let secondElem = document.createElement('span');
        //         secondElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
        //             '<span style="font-weight: bold;">' + e[fullLoc[4]][fullLoc[5]]["name"] + '</span>';
        //         breadCrumbs.appendChild(secondElem);
        //
        //         if (typeof fullLoc[6] !== 'undefined' && fullLoc[5] !== 'all_history')
        //         {
        //             let thirdElem = document.createElement('span');
        //             thirdElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
        //                 '<span style="font-weight: bold;">' + e[fullLoc[4]][fullLoc[5]][fullLoc[6]] + '</span>';
        //             breadCrumbs.appendChild(thirdElem);
        //
        //             if (typeof fullLoc[7] !== 'undefined' && fullLoc[6] === 'edit')
        //             {
        //                 let forthElem = document.createElement('span');
        //                 forthElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
        //                     '<span style="font-weight: bold;">№ ' + fullLoc[7] + '</span>';
        //                 breadCrumbs.appendChild(forthElem);
        //             }
        //         }
        //     }
        // }
    }

    forceUpdatePage(){
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
                                        <Route path="/forgotPassword" render={(props) => (<ForgotPassword {...props} />)} />
                                        <Route path="/password/reset/:token" render={(props) => (<ResetForm {...props} />)} />
                                        <Route path="/editPersonalData" render={(props) => (<EditPersonalData {...props} />)} />
                                        <Route path="/editPassword" render={(props) => (<EditPassword {...props} />)} />
                                        <Route path="/login" render={(props) => (<Login breadCrumbs={this.breadCrumbs.bind(this)} {...props} />)} />
                                        <Route path="/register" render={(props) => (<Register {...props} />)} />

                                        <Route path="/panel/base-page" render={(props) => ( <BasePagePanel breadCrumbs={this.breadCrumbs.bind(this)} /> )} />
                                        <Route path="/panel/common/files/all" exact render={(props) =>(<FilesAll {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/common/files/images" exact render={(props) =>(<FilesImages {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/common/login" render={(props) => ( <Login {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/common/first_login" render={(props) => ( <FirstLogin {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/common/register" render={(props) => ( <Register breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/common/edit-personal-data" render={(props) => ( <EditPersonalData breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/common/edit-password" render={(props) => ( <EditPassword breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/common/export_to_excel" render={(props) => (<ExportToExcel {...props} breadCrumbs={this.breadCrumbs.bind(this)} /> )} />
                                        <Route path="/panel/apz/all_history/:user_id/:page" exact render={(props) =>(<AllApzsHistory {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/services/:index" exact render={(props) =>(<Actions {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/apz/status/:status/:page" exact render={(props) =>(<CitizenAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/apz/add" exact render={(props) =>(<CitizenAddApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/apz/edit/:id" exact render={(props) =>(<CitizenAddApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/apz/show/:id" exact render={(props) =>(<CitizenShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/sketch/status/:status/:page" render={(props) => ( <CitizenAllSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/citizen/sketch/show/:id" exact render={(props) =>(<CitizenShowSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/sketch/add" exact render={(props) =>(<CitizenAddSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/citizen/sketch/edit/:id" exact render={(props) =>(<CitizenAddSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/admin/apz/status/:status/:page" exact render={(props) =>(<AdminAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/admin/apz/show/:id" exact render={(props) =>(<AdminShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/admin/apz/update/:id" exact render={(props) =>(<AdminUpdateApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/admin/user-roles/:page" exact render={(props) => ( <Admin {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/admin/users/add" render={(props) => ( <AddUsers {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

                                        <Route path="/panel/urban/apz/status/:status/:page" exact render={(props) =>(<UrbanAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/urban/apz/show/:id" exact render={(props) =>(<UrbanShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/urban/sketch/status/:status/:page" render={(props) => ( <UrbanAllSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/urban/sketch/show/:id" exact render={(props) =>(<UrbanShowSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/answer-template/all/:type/:page" exact render={(props) =>(<AllTemplates {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/answer-template/:type/add" exact render={(props) =>(<AddTemplate {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/answer-template/show/:type/:id" exact render={(props) =>(<ShowTemplate {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/elector-provider/apz/status/:status/:page" exact render={(props) =>(<ProviderElectroAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/elector-provider/apz/show/:id" exact render={(props) =>(<ProviderElectroShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/gas-provider/apz/status/:status/:page" exact render={(props) =>(<ProviderGasAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gas-provider/apz/show/:id" exact render={(props) =>(<ProviderGasShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/heat-provider/apz/status/:status/:page" exact render={(props) =>(<ProviderHeatAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/heat-provider/apz/show/:id" exact render={(props) =>(<ProviderHeatShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/water-provider/apz/status/:status/:page" exact render={(props) =>(<ProviderWaterAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/water-provider/apz/show/:id" exact render={(props) =>(<ProviderWaterShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/phone-provider/apz/status/:status/:page" exact render={(props) =>(<ProviderPhoneAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/phone-provider/apz/show/:id" exact render={(props) =>(<ProviderPhoneShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/head/apz/status/:status/:page" exact render={(props) =>(<HeadAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/head/apz/show/:id" exact render={(props) =>(<HeadShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/head/sketch/status/:status/:page" render={(props) => ( <HeadAllSketches {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                                        <Route path="/panel/head/sketch/show/:id" exact render={(props) =>(<HeadShowSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/office/apz/all/:page" exact render={(props) =>(<OfficeAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/office/apz/show/:id" exact render={(props) =>(<OfficeShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/lawyer/apz/status/:status/:page" exact render={(props) =>(<LawyerAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/lawyer/apz/show/:id" exact render={(props) =>(<LawyerShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/scheme_road/apz/status/:status/:page" exact render={(props) =>(<SchemeRoadAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/scheme_road/apz/show/:id" exact render={(props) =>(<SchemeRoadShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/scheme_road_head/apz/status/:status/:page" exact render={(props) =>(<SchemeRoadHeadAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/scheme_road_head/apz/show/:id" exact render={(props) =>(<SchemeRoadHeadShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/engineer/apz/status/:status/:page" exact render={(props) =>(<EngineerAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/engineer/apz/show/:id" exact render={(props) =>(<EngineerShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/engineer/apz/edit/:id" exact render={(props) =>(<EngineerEditApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/engineer/sketch/status/:status/:page" exact render={(props) =>(<EngineerAllSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/engineer/sketch/show/:id" exact render={(props) =>(<EngineerShowSketch {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/state_services/apz/status/:status/:page" exact render={(props) =>(<StateServicesAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/state_services/apz/show/:id" exact render={(props) =>(<StateServicesShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/gen_plan/apz/status/:status/:page" exact render={(props) =>(<GenPlanAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan/apz/show/:id" exact render={(props) =>(<GenPlanShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_head/apz/status/:status/:page" exact render={(props) =>(<GenPlanHeadAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_head/apz/show/:id" exact render={(props) =>(<GenPlanHeadShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_scheme/apz/status/:status/:page" exact render={(props) =>(<GenPlanSchemeAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_scheme/apz/show/:id" exact render={(props) =>(<GenPlanSchemeShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_calculation/apz/status/:status/:page" exact render={(props) =>(<GenPlanCalculationAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/gen_plan_calculation/apz/show/:id" exact render={(props) =>(<GenPlanCalculationShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                                        <Route path="/panel/head_state_services/apz/status/:status/:page" exact render={(props) =>(<HeadStateServicesAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                                        <Route path="/panel/head_state_services/apz/show/:id" exact render={(props) =>(<HeadStateServicesShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

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

ReactDOM.render(
    <Main />, document.getElementById('root')
);
