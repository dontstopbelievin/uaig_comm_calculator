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
import Npm from './routes/Npm';
import public_services from './routes/public_services';
import permission_and_covoting from './routes/permission_and_covoting';
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

window.jQuery = require('jquery');
window.Popper = require('popper.js').default;

require('bootstrap-material-design');
require('./assets/css/style.css');
require('glyphicons-only-bootstrap/css/bootstrap.min.css');


export default class Main extends React.Component {

  setLang() {
    return localStorage.getItem('lang') ? true : localStorage.setItem('lang', 'ru');
  }

  componentWillMount() {
    this.setLang();

    window.url = 'http://uaig/';
    // window.url = 'http://uaig/';
    window.clientSecret = 'ISOzCLPBZCRLPz7V7bS9p7ysuaJUQIPC6N6COoH6'; // Nurseit
    // window.clientSecret = 'cYwXsxzsXtmca6BfALhYtDfGXIQy3PxdXIhY9ZxP'; // Bagdat
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
          <div style={{minHeight: '100vh', position: 'relative'}}>
            <Route render={(props) => (<Header {...props} />)} />
            <Switch>
              <Route exact path="/" render={(props) => (<Guest {...props} />)} />
              <Route path="/map" render={(props) => (<MapView {...props} />)} />
              <Route path="/map2d" render={(props) => (<Map2dView {...props} />)} />
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
