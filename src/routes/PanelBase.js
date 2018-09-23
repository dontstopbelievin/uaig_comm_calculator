import React from 'react';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/breadCrumbs.json';
import '../assets/css/NewsArticle.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import WOW from 'wowjs';
import $ from 'jquery';
import Loader from 'react-loader-spinner';
import Citizen from "./Citizen";
import Sketch from "./Sketch";
import Files from "./Files";
import BasePagePanel from "./BasePagePanel";
import Admin from "./Admin";
import AddPages from "./AddPages";
import Menu from "./Menu";
import NewsPanel from "./NewsPanel";
import UsersQuestions from "./UsersQuestions";
import Urban from "./Urban";
import UrbanReport from "./UrbanReport";
import AnswerTemplate from "./AnswerTemplate";
import ProviderElectro from "./ProviderElectro";
import ProviderGas from "./ProviderGas";
import ProviderHeat from "./ProviderHeat";
import ProviderWater from "./ProviderWater";
import ProviderPhone from "./ProviderPhone";
import Head from "./Head";
import HeadReport from "./HeadReport";
import Office from "./Office";
import Engineer from "./Engineer";
import PhotoReportsManage from "./PhotoReportsManage";
import PhotoReportsCitizen from './PhotoReportsCitizen';
import ApzDepartment from "./ApzDepartment";
import SketchApzDepartment from "./SketchApzDepartment";
import Temporary from "./Temporary";
import Register from "./Register";
import Login from "./Login";
import EditPersonalData from "./EditPersonalData";
import EditPassword from "./EditPassword";
import ResetForm from "./ResetForm";
import Vacancies from "./Vacancies";

let e = new LocalizedStrings({ru,kk});

export default class PanelBase extends React.Component{

  constructor() {
    super();
    (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

    this.state = {
      tokenExists: false,
      loaderHidden: true
    };
  }
  componentDidMount() {

  }

  breadCrumbs() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let fullLoc = window.location.href.split('/');
    let breadCrumbs = document.getElementById('breadCrumbs');
    breadCrumbs.innerHTML = "";

    if (fullLoc[4] === 'panel')
    {
      let firstElem = document.createElement('a');
      let firstElemAttributeHref = document.createAttribute('href');
      firstElemAttributeHref.value = "/#/panel";
      let firstElemAttributeClass = document.createAttribute('class');
      firstElemAttributeClass.value = "active";
      firstElem.innerHTML = e['electron-architecture'];
      firstElem.setAttributeNode(firstElemAttributeHref);
      firstElem.setAttributeNode(firstElemAttributeClass);
      breadCrumbs.appendChild(firstElem);
      if ( typeof fullLoc[5] !== 'undefined' && typeof fullLoc[6] === 'undefined' )
      {
        let secondElem = document.createElement('span');
        secondElem.innerHTML = ' <span style="color:#e0b431;font-weight: bold;font-size:14px;">></span> ' +
        '<span style="font-weight: bold;">' + e[fullLoc[5]] + '</span> ';
        breadCrumbs.appendChild(secondElem);

      }else if (typeof fullLoc[5] !== 'undefined' && typeof fullLoc[6] !== 'undefined')
      {

        if (typeof fullLoc[7] !== 'undefined')
        {
          let secondElem = document.createElement('span');
          console.log(fullLoc);
          secondElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<a href="/#' + e[fullLoc[5]][fullLoc[6]]["link"] + '">' + e[fullLoc[5]][fullLoc[6]]["name"] + '</a>';
          breadCrumbs.appendChild(secondElem);

          let thirdElem = document.createElement('span');
          thirdElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<span style="font-weight: bold;">' + e[fullLoc[5]][fullLoc[6]][fullLoc[7]] + '</span>';
          breadCrumbs.appendChild(thirdElem);
          
          if (typeof fullLoc[8] !== 'undefined')
          {
            if (fullLoc[7] === 'edit')
            {
              let forthElem = document.createElement('span');
              forthElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
                '<span style="font-weight: bold;">№ ' + fullLoc[8] + '</span>';
              breadCrumbs.appendChild(forthElem);
            }
          }

        }else if (typeof fullLoc[7] === 'undefined')
        {
          let secondElem = document.createElement('span');
          secondElem.innerHTML = ' <span style="color:#e0b431;font-weight:bold;font-size:14px;">></span> ' +
            '<span style="font-weight: bold;">' + e[fullLoc[5]][fullLoc[6]]["name"] + '</span>';
          breadCrumbs.appendChild(secondElem);
        }

      }
    }
  }

  componentWillMount () {

  }

  render() {
    var roleIsSet = sessionStorage.getItem('token');
    return(
      <div className="container body-content">

        <div className="container navigational_price" id={'breadCrumbs'}>
          {/*  here must be links   */}
        </div>

        {!sessionStorage.getItem('tokenInfo')&&
        <div>
          <div className="alert alert-danger" role="alert">
            Для работы в системе необходимо <a href={"/#/panel/common/login"}>войти </a>
            или <a href={"/#/panel/common/register"}>зарегистрироваться</a>.
          </div>
        </div>
        }

        <div className="content container citizen-apz-list-page">
          <div>
            <div>
              <Switch>
                {/*  the routes is using for role: ALL  */}
                <Route path="/panel/base-page" render={(props) => ( <BasePagePanel breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/files" render={(props) => ( <Files breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/login" render={(props) => ( <Login breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/register" render={(props) => ( <Register breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/edit-personal-data" render={(props) => ( <EditPersonalData breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/edit-password" render={(props) => ( <EditPassword breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/common/vacancies" render={(props) => ( <Vacancies breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*<Route path="/panel/common/password-reset/:token" render={(props) => ( <ResetForm breadCrumbs={this.breadCrumbs.bind(this)}/> )} />*/}
                {/*  the routes is using for role: ALL  */}

                {/*  the routes is using for role: Citizen  */}
                <Route path="/panel/citizen/apz" render={(props) => ( <Citizen breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/citizen/sketch" render={(props) => ( <Sketch breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/citizen/photoreports" render={(props) => ( <PhotoReportsCitizen breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Citizen  */}

                {/*  the routes is using for role: Admin  */}
                <Route path="/panel/admin/user-roles" render={(props) => ( <Admin breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/admin/addPages" render={(props) => ( <AddPages breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/admin/menuEdit" render={(props) => ( <Menu breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/admin/newsPanel" render={(props) => ( <NewsPanel breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/admin/usersQuestions" render={(props) => ( <UsersQuestions breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Admin  */}

                {/*  the routes is using for role: Reporter  */}
                <Route path="/panel/reporter/newsPanel" render={(props) => ( <NewsPanel breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Reporter  */}

                {/*  the routes is using for role: Urban */}
                <Route path="/panel/urban/apz" render={(props) => ( <Urban breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/urban/answer-template" render={(props) => ( <AnswerTemplate breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Urban */}

                {/*  the routes is using for role: Elector-Provider */}
                <Route path="/panel/elector-provider/apz" render={(props) => ( <ProviderElectro breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Elector-Provider */}

                {/*  the routes is using for role: Gas-Provider */}
                <Route path="/panel/gas-provider/apz" render={(props) => ( <ProviderGas breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Gas-Provider */}

                {/*  the routes is using for role: Heat-Provider */}
                <Route path="/panel/heat-provider/apz" render={(props) => ( <ProviderHeat breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Heat-Provider */}

                {/*  the routes is using for role: Water-Provider */}
                <Route path="/panel/water-provider/apz" render={(props) => ( <ProviderWater breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Water-Provider */}

                {/*  the routes is using for role: Phone-Provider */}
                <Route path="/panel/phone-provider/apz" render={(props) => ( <ProviderPhone breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Phone-Provider */}

                {/*  the routes is using for role: Head */}
                <Route path="/panel/head/apz" render={(props) => ( <Head breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/head/headreport" render={(props) => ( <HeadReport breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Head */}

                 {/*  the routes is using for role: Office */}
                <Route path="/panel/office/apz" render={(props) => ( <Office breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Office */}

                {/*  the routes is using for role: Engineer */}
                <Route path="/panel/engineer/apz" render={(props) => ( <Engineer breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Engineer */}

                {/*  the routes is using for role: PhotoReporter */}
                <Route path="/panel/photo-reporter/photoreportsManage" render={(props) => ( <PhotoReportsManage breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: PhotoReporter */}

                {/*  the routes is using for role: ApzDepartment */}
                <Route path="/panel/apz-department/apz" render={(props) => ( <ApzDepartment breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                <Route path="/panel/apz-department/sketch" render={(props) => ( <SketchApzDepartment breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: ApzDepartment */}

                {/*  the routes is using for role: Temporary */}
                <Route path="/panel/temporary/self-page" render={(props) => ( <Temporary breadCrumbs={this.breadCrumbs.bind(this)}/> )} />
                {/*  the routes is using for role: Temporary */}

                <Redirect from="/" to="/panel/base-page" />
              </Switch>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
