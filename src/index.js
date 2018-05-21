import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
//import LocalizedStrings from 'react-localization';
import Header from './components/Header';
import Guest from './routes/Guest';
import MapView from './routes/Map';
import Map2dView from './routes/Map2d';
import Photos from './routes/Photos';
import Login from './routes/Login';
import Register from './routes/Register';
import Temporary from './routes/Temporary';
import Citizen from './routes/Citizen';
import Urban from './routes/Urban';
import UrbanReport from './routes/UrbanReport';
import Head from './routes/Head';
import HeadReport from './routes/HeadReport';
import ProviderElectro from './routes/ProviderElectro';
import ProviderGas from './routes/ProviderGas';
import ProviderPhone from './routes/ProviderPhone';
import ProviderHeat from './routes/ProviderHeat';
import ProviderWater from './routes/ProviderWater';
import Project from './routes/Project';
import PhotoReports from './routes/PhotoReports';
import PhotoReportsManage from './routes/PhotoReportsManage';
import Admin from './routes/Admin';
import Files from './routes/Files';
import Sketch from './routes/Sketch';
import Review from './routes/Review';
import BudgetPlan from './routes/BudgetPlan';
import VideoTutorials from './routes/VideoTutorials';
import Polls from './routes/Polls';
import DesignCode from './routes/DesignCode';
import CouncilMaterials from './routes/CouncilMaterials';
import Reports from './routes/Reports';
import Stats from './routes/Stats';
import Footer from './components/Footer';
import News from './routes/News';
import NewsPanel from './routes/NewsPanel';
import NewsAll from './routes/NewsAll';
import NewsArticle from './routes/NewsArticle';
import NewsByDay from './routes/NewsByDay';
import AnswerTemplate from './routes/AnswerTemplate';
import EditData from './routes/EditPersonalData'
import EditPassword from './routes/EditPassword'
import ForgotPassword from './routes/ForgotPassword'
import ResetForm from './routes/ResetForm'
import Npm from './routes/Npm';
import public_services from './routes/public_services';
import permission_and_covoting from './routes/permission_and_covoting';
import Vacancies from './routes/Vacancies';
import GovermentServices from './routes/GovermentServices';
//import legalpurchase from './routes/Legalpurchase';
import Counteraction from './routes/Counteraction';
import Contacts from './routes/Contacts';
import architectural_and_town_planning_activity from './routes/Architectural_and_town_planning_activity';
import Control from './routes/Control';
import TimeOfReception from './routes/TimeOfReception';
import Engineer from './routes/Engineer.js';
import Apz from './routes/Apz.js';
import DoingBusiness from './routes/DoingBusiness.js';
import ApzDepartment from './routes/ApzDepartment.js';
import BisunessBuilding from './routes/BisunessBuilding';
import InfoAboutDepartment from './routes/InfoAboutDepartment.js';
import Population from './routes/Population.js';
import Staff from './routes/Staff.js';
import EntrepreneurSupport from './routes/EntrepreneurSupport.js';
import ExecutiveAgency from './routes/ExecutiveAgency.js';
import TypeOfPublicService from './routes/TypeOfPublicService.js';
import StateSymbols from './routes/StateSymbols.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import PopperJs from 'popper.js';
import AddPages from "./routes/AddPages";
import Page from "./routes/Page";
// import tether from 'tether';
// global.Tether = tether;
//import 'bootstrap/dist/css/bootstrap.min.css';

window.jQuery = require('jquery');
// window.Popper = require('popper.js').default;

//require('bootstrap-material-design');
//require('./assets/css/style.css');
//require('bootstrap/dist/css/bootstrap.min.css');
require('glyphicons-only-bootstrap/css/bootstrap.min.css');
require('./assets/css/common.css');
require('./assets/css/animate.css');

export default class Main extends React.Component {

  setLang() {
    return localStorage.getItem('lang') ? true : localStorage.setItem('lang', 'ru');
  }

  componentWillMount() {
    this.setLang();


    window.url = 'https://api.uaig.kz:8843/';
    window.clientSecret = 'bQ9kWmn3Fq51D6bfh7pLkuju0zYqTELQnzeKuQM4'; // SERVER

     //window.url = 'http://uaig/';
     //window.clientSecret = 'cYwXsxzsXtmca6BfALhYtDfGXIQy3PxdXIhY9ZxP'; // dimash
  }

  componentDidMount() {
    //console.log("MainComponent did mount");
  }

  componentWillUnmount() {
    //console.log("MainComponent will unmount");
  }


  render() {
    //console.log("rendering the MainComponent");
    //console.log(this.props);
    return (
        <HashRouter>
          <div>
            <Route render={(props) => (<Header {...props} />)} />
            <Switch>
              <Route exact path="/" render={(props) => (<Guest {...props} />)} />
              <Route path="/map" render={(props) => (<MapView {...props} />)} />
              <Route path="/map2d" render={(props) => (<Map2dView {...props} />)} />
              <Route path="/forgotPassword" render={(props) => (<ForgotPassword {...props} />)} />
              <Route path="/password/reset/:token" render={(props) => (<ResetForm {...props} />)} />
              <Route path="/editPersonalData" render={(props) => (<EditData {...props} />)} />
              <Route path="/editPassword" render={(props) => (<EditPassword {...props} />)} />
              <Route path="/photos" render={(props) => (<Photos {...props} />)} />
              <Route path="/login" render={(props) => (<Login {...props} />)} />
              <Route path="/register" render={(props) => (<Register {...props} />)} />
              <Route path="/temporary" render={(props) => (<Temporary {...props} />)} />
              <Route path="/urban" render={(props) => (<Urban {...props} />)} />
              <Route path="/urbanreport" render={(props) => (<UrbanReport {...props} />)} />
              <Route path="/head" render={(props) => (<Head {...props} />)} />
              <Route path="/headreport" render={(props) => (<HeadReport {...props} />)} />
              <Route path="/citizen" render={(props) => (<Citizen {...props} />)} />
              <Route path="/providerelectro" render={(props) => (<ProviderElectro {...props} />)} />
              <Route path="/providergas" render={(props) => (<ProviderGas {...props} />)} />
              <Route path="/providerphone" render={(props) => (<ProviderPhone {...props} />)} />
              <Route path="/providerheat" render={(props) => (<ProviderHeat {...props} />)} />
              <Route path="/providerwater" render={(props) => (<ProviderWater {...props} />)} />
              <Route path="/project" render={(props) => (<Project {...props} />)} />
              <Route path="/photoreports" render={(props) => (<PhotoReports {...props} />)} />
              <Route path="/photoreportsManage" render={(props) => (<PhotoReportsManage {...props} />)} />
              <Route path="/admin" render={(props) => (<Admin {...props} />)} />
              <Route path="/files" render={(props) => (<Files {...props} />)} />
              <Route path="/sketch" render={(props) => (<Sketch {...props} />)} />
              <Route path="/reviews" render={(props) => (<Review {...props} />)} />
              <Route path="/polls" render={(props) => (<Polls {...props} />)} />
              <Route path="/designCode" render={(props) => (<DesignCode {...props} />)} />
              <Route path="/councilMaterials" render={(props) => (<CouncilMaterials {...props} />)} />
              <Route path="/reports" render={(props) => (<Reports {...props} />)} />
              <Route path="/stats" render={(props) => (<Stats {...props} />)} />
              <Route path="/budget_plan" render={(props) => (<BudgetPlan {...props} />)} />
              <Route path="/tutorials" render={(props) => (<VideoTutorials {...props} />)} />
              <Route path="/news" render={(props) => (<News {...props}/>)}/>
              <Route path="/newsPanel" render={(props) => (<NewsPanel {...props}/>)}/>
              <Route path="/answertemplate" render={(props) => (<AnswerTemplate {...props}/>)}/>
              <Route path="/addPages" render={(props) => (<AddPages {...props}/>)}/>
              <Route path="/public_services" render={(props) => (<public_services {...props}/>)}/>
              <Route path="/permission_and_covoting" render={(props) => (<permission_and_covoting {...props}/>)}/>
              <Route path="/npm" render={(props) => (<Npm {...props}/>)}/>
              <Route path="/legalpurchese" render={(props) => (<legalpurchese {...props}/>)}/>
              <Route path="/counteraction" render={(props) => (<Counteraction {...props}/>)}/>
              <Route path="/control" render={(props) => (<Control {...props}/>)}/>
              <Route path="/contacts" render={(props) => (<Contacts {...props}/>)}/>
              <Route path="/timeOfReception" render={(props) => (<TimeOfReception {...props}/>)}/>
              <Route path="/architectural_and_town_planning_activity" render={(props) => (<architectural_and_town_planning_activity {...props}/>)}/>
              <Route path="/engineer" render={(props) => (<Engineer {...props}/>)}/>
              <Route path="/apz" render={(props) => (<Apz {...props}/>)}/>
              <Route path="/doingBusiness" render={(props) => (<DoingBusiness {...props}/>)}/>
              <Route path="/apz_department" render={(props) => (<ApzDepartment {...props}/>)}/>
              <Route path="/businessbuilding" render={(props) => (<BisunessBuilding {...props}/>)}/>
              <Route path="/infoaboutdepartment" render={(props) => (<InfoAboutDepartment {...props}/>)}/>
              <Route path="/govermentservices" render={(props) => (<GovermentServices {...props}/>)}/>
              <Route path="/population" render={(props) => (<Population {...props}/>)}/>
              <Route path="/staff" render={(props) => (<Staff {...props}/>)}/>
              <Route path="/entrepreneurialsupport" render={(props) => (<EntrepreneurSupport {...props}/>)}/>
              <Route path="/executiveagency" render={(props) => (<ExecutiveAgency {...props}/>)}/>
              <Route path="/newsAll" render={(props) => (<NewsAll {...props}/>)}/>
              <Route path="/newsArticle/:id" render={(props) => (<NewsArticle {...props}/>)}/>
              <Route path="/vacancies" render={(props) => (<Vacancies {...props}/>)}/>
              <Route path="/dayNews/:date" render={(props) => (<NewsByDay {...props}/>)}/>
              <Route path="/typeofpublicservice" render={(props) => (<TypeOfPublicService {...props}/>)}/>
              <Route path="/statesymbols" render={(props) => (<StateSymbols {...props}/>)}/>
              <Route path="/page/:id" render={(props) => (<Page {...props}/>)}/>
            </Switch>
            <Footer />
          </div>
        </HashRouter>
      )
  }
}

ReactDOM.render(
  <Main />, document.getElementById('root')
);
