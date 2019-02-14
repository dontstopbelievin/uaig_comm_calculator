import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Login from './routes/authorization/Login';
import Register from './routes/authorization/Register';
import Citizen from './routes/Citizen';
import Sketch from './routes/Sketch';
import SketchApzDepartment from './routes/SketchApzDepartment';
import Footer from './components/Footer';
import EditPersonalData from './routes/authorization/EditPersonalData';
import EditPassword from './routes/authorization/EditPassword';
import ForgotPassword from './routes/authorization/ForgotPassword';
import ResetForm from './routes/authorization/ResetForm';
import FirstLogin from "./routes/authorization/FirstLogin";
import SketchUrban from "./routes/SketchUrban";

import './imports/styles';
import './imports/js';
import LocalizedStrings from 'react-localization';
import {ru, kk} from './languages/breadCrumbs.json';
import { NavLink, Link, Redirect } from 'react-router-dom';
import WOW from 'wowjs';
import $ from 'jquery';

import Loader from 'react-loader-spinner';
import BasePagePanel from "./routes/BasePagePanel";
import SketchEngineer from "./routes/SketchEngineer";
import SketchHead from "./routes/SketchHead";
import ExportToExcel from "./components/ExportToExcel";
import UrbanAllApzs from "./routes/apz/urban/AllApzs";
import UrbanSearchAllApzs from "./routes/apz/urban/SearchAllApzs";
import UrbanShowApz from "./routes/apz/urban/ShowApz";
import AllTemplates from "./routes/reject_templates/AllTemplates";
import AddTemplate from "./routes/reject_templates/AddTemplate";
import ShowTemplate from "./routes/reject_templates/ShowTemplate";
import EngineerAllApzs from "./routes/apz/engineer/AllApzs";
import EngineerSearchAllApzs from "./routes/apz/engineer/SearchAllApzs";
import EngineerShowApz from "./routes/apz/engineer/ShowApz";
import ApzDepartmentAllApzs from "./routes/apz/apz_department/AllApzs";
import ApzDepartmentShowApz from "./routes/apz/apz_department/ShowApz";
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
import Admin from './routes/admin/Admin';
import AddUsers from "./routes/admin/AddUsers";
import OfficeAllApzs from "./routes/office/AllApzs";
import OfficeShowApz from "./routes/office/ShowApz";
import FilesAll from "./routes/files/AllFiles";
import FilesImages from "./routes/files/Images";

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
    // window.url = 'http://192.168.0.231/';
    // window.url = 'http://shymkentback.uaig.kz/';
    // window.clientSecret = 'bQ9kWmn3Fq51D6bfh7pLkuju0zYqTELQnzeKuQM4'; // SERVER

    window.url = 'http://uaig/';
    //window.clientSecret = 'cYwXsxzsXtmca6BfALhYtDfGXIQy3PxdXIhY9ZxP'; // dimash
    //window.clientSecret = 'G0TMZKoKPW4hXZ9hXUCfq7KYxENEqB6AaQgzmIt9'; // zhalgas
     window.clientSecret = 'B5BCHoPxj4VhKUqs7WHi2HHx6f24xoIK8065tc4s'; // aman
    // window.clientSecret = 'saJNJSmE3nUg22fThaUuQfCChKFeYjLE8cscRTfu'; // taiyr
    // window.clientSecret = '7zdU2XDblqORFq8wbQHlNRaIgEBR90qbMYnnVWDg'; // yernar
  }

  breadCrumbs() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let fullLoc = window.location.href.split('/');
    let breadCrumbs = document.getElementById('breadCrumbs');
    breadCrumbs.innerHTML = "";
    console.log(fullLoc);

    if (fullLoc[3] === 'panel')
    {
      let firstElem = document.createElement('a');
      let firstElemAttributeHref = document.createAttribute('href');
      firstElemAttributeHref.value = "/panel";
      let firstElemAttributeClass = document.createAttribute('class');
      firstElemAttributeClass.value = "active";
      firstElem.innerHTML = e['electron-architecture'];
      firstElem.setAttributeNode(firstElemAttributeHref);
      firstElem.setAttributeNode(firstElemAttributeClass);
      breadCrumbs.appendChild(firstElem);
      if ( typeof fullLoc[4] !== 'undefined' && typeof fullLoc[5] === 'undefined' )
      {
        let secondElem = document.createElement('span');
        secondElem.innerHTML = ' <span style="color:#e0b431;font-weight: bold;font-size:14px;">></span> ' +
        '<span style="font-weight: bold;">' + e[fullLoc[4]] + '</span> ';
        breadCrumbs.appendChild(secondElem);

      }else if (typeof fullLoc[4] !== 'undefined' && typeof fullLoc[5] !== 'undefined')
      {

        if (typeof fullLoc[6] !== 'undefined')
        {
          let secondElem = document.createElement('span');
          //console.log(fullLoc);
          secondElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<Link to="/#' + e[fullLoc[4]][fullLoc[5]]["link"] + '">' + e[fullLoc[4]][fullLoc[5]]["name"] + '</Link>';
          breadCrumbs.appendChild(secondElem);

          let thirdElem = document.createElement('span');
          thirdElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<span style="font-weight: bold;">' + e[fullLoc[4]][fullLoc[5]][fullLoc[6]] + '</span>';
          breadCrumbs.appendChild(thirdElem);

          if (typeof fullLoc[7] !== 'undefined')
          {
            if (fullLoc[6] === 'edit')
            {
              let forthElem = document.createElement('span');
              forthElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
                '<span style="font-weight: bold;">№ ' + fullLoc[7] + '</span>';
              breadCrumbs.appendChild(forthElem);
            }
          }

        }else if (typeof fullLoc[6] === 'undefined')
        {
          let secondElem = document.createElement('span');
          secondElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<span style="font-weight: bold;">' + e[fullLoc[4]][fullLoc[5]]["name"] + '</span>';
          breadCrumbs.appendChild(secondElem);
        }
      }
    }
  }

  render() {
    var roleIsSet = sessionStorage.getItem('token');
    return (
        <BrowserRouter>
          <div>
            <Route render={(props) => (<Header {...props} />)} />
            <div className="container body-content">
              <div className="container navigational_price" id={'breadCrumbs'}></div>
              <div className="content container citizen-apz-list-page">
                <div>
                  <div>
                    <Switch>
                      <Route path="/forgotPassword" render={(props) => (<ForgotPassword {...props} />)} />
                      <Route path="/password/reset/:token" render={(props) => (<ResetForm {...props} />)} />
                      <Route path="/editPersonalData" render={(props) => (<EditPersonalData {...props} />)} />
                      <Route path="/editPassword" render={(props) => (<EditPassword {...props} />)} />
                      <Route path="/login" render={(props) => (<Login {...props} />)} />
                      <Route path="/register" render={(props) => (<Register {...props} />)} />
                      <Route path="/panel/sketch/urban" render={(props) => (<SketchUrban {...props} />)} />
                      <Route path="/citizen" render={(props) => (<Citizen {...props} />)} />
                      <Route path="/sketch" render={(props) => (<Sketch {...props} />)} />
                      <Route path="/panel/sketch/apz_department" render={(props) => (<SketchApzDepartment {...props} />)} />

                      <Route path="/panel/base-page" render={(props) => ( <BasePagePanel breadCrumbs={this.breadCrumbs.bind(this)} /> )} />
                      <Route path="/panel/common/files/all" exact render={(props) =>(<FilesAll {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/common/files/images" exact render={(props) =>(<FilesImages {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/common/login" render={(props) => ( <Login {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/common/first_login" render={(props) => ( <FirstLogin {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/common/register" render={(props) => ( <Register breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/common/edit-personal-data" render={(props) => ( <EditPersonalData breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/common/edit-password" render={(props) => ( <EditPassword breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/common/export_to_excel" render={(props) => (<ExportToExcel {...props} breadCrumbs={this.breadCrumbs.bind(this)} /> )} />

                      <Route path="/panel/citizen/apz" render={(props) => ( <Citizen breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/citizen/sketch" render={(props) => ( <Sketch breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

                      <Route path="/panel/admin/apz/status/:status/:page" exact render={(props) =>(<AdminAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/admin/apz/show/:id" exact render={(props) =>(<AdminShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/admin/user-roles/:page" exact render={(props) => ( <Admin {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/admin/users/add" render={(props) => ( <AddUsers breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

                      <Route path="/panel/urban/apz/status/:status/:page" exact render={(props) =>(<UrbanAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/urban/apz/show/:id" exact render={(props) =>(<UrbanShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/urban/sketch" render={(props) => ( <SketchUrban {...props} breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                      <Route path="/panel/urban/answer-template/all/:type/:page" exact render={(props) =>(<AllTemplates {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/urban/answer-template/:type/add" exact render={(props) =>(<AddTemplate {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/urban/answer-template/show/:type/:id" exact render={(props) =>(<ShowTemplate {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

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
                      <Route path="/panel/head/sketch" render={(props) => ( <SketchHead breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

                      <Route path="/panel/office/apz/all/:page" exact render={(props) =>(<OfficeAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/office/apz/show/:id" exact render={(props) =>(<OfficeShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />

                      <Route path="/panel/engineer/apz/status/:status/:page" exact render={(props) =>(<EngineerAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/engineer/apz/search/:page" exact render={(props) =>(<EngineerSearchAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/engineer/apz/show/:id" exact render={(props) =>(<EngineerShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/engineer/sketch" render={(props) => ( <SketchEngineer breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

                      <Route path="/panel/apz-department/apz/status/:status/:page" exact render={(props) =>(<ApzDepartmentAllApzs {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/apz-department/apz/show/:id" exact render={(props) =>(<ApzDepartmentShowApz {...props} breadCrumbs={this.breadCrumbs.bind(this)} />)} />
                      <Route path="/panel/apz-department/sketch" render={(props) => ( <SketchApzDepartment breadCrumbs={this.breadCrumbs.bind(this)}/> )} />

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
