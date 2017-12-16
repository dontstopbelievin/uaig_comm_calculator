import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
//import LocalizedStrings from 'react-localization';
import Header from './components/Header';
import Guest from './routes/Guest';
import MapView from './routes/Map';
import Photos from './routes/Photos';
import Login from './routes/Login';
import Register from './routes/Register';
import Temporary from './routes/Temporary';
import Citizen from './routes/Citizen';
import Urban from './routes/Urban';
import Head from './routes/Head';
import Provider from './routes/Provider';
import Project from './routes/Project';
import PhotoReports from './routes/PhotoReports';
import PhotoReportsManage from './routes/PhotoReportsManage';
import Admin from './routes/Admin';
import Files from './routes/Files';
import Sketch from './routes/Sketch';
import Review from './routes/Review';
import Footer from './components/Footer';

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
    window.url = 'http://localhost:53844/';  
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
              <Route path="/photos" render={(props) => (<Photos {...props} />)} />
              <Route path="/login" render={(props) => (<Login {...props} />)} />
              <Route path="/register" render={(props) => (<Register {...props} />)} />
              <Route path="/temporary" render={(props) => (<Temporary {...props} />)} />
              <Route path="/urban" render={(props) => (<Urban {...props} />)} />
              <Route path="/head" render={(props) => (<Head {...props} />)} />
              <Route path="/citizen" render={(props) => (<Citizen {...props} />)} />
              <Route path="/provider" render={(props) => (<Provider {...props} />)} />
              <Route path="/project" render={(props) => (<Project {...props} />)} />
              <Route path="/photoreports" render={(props) => (<PhotoReports {...props} />)} />
              <Route path="/photoreportsManage" render={(props) => (<PhotoReportsManage {...props} />)} />
              <Route path="/admin" render={(props) => (<Admin {...props} />)} />
              <Route path="/files" render={(props) => (<Files {...props} />)} />
              <Route path="/sketch" render={(props) => (<Sketch {...props} />)} />
              <Route path="/reviews" render={(props) => (<Review {...props} />)} />
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