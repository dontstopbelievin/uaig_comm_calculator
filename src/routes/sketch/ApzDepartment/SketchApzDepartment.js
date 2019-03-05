import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import AllSketch from './AllSketch';
import ShowSketch from './ShowSketch';
import ShowMap from './ShowMap';

export default class SketchApzDepartment extends React.Component {
  render() {
    return (
      <div className="content container body-content citizen-sketch-list-page">
        <div>

          <div className="card-body">
            <Switch>
              <Route path="/panel/apz-department/sketch/status/:status/:page" exact render={(props) =>(
                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Route path="/panel/apz-department/sketch/show/:id" exact render={(props) =>(
                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
              )} />
              <Redirect from="/panel/apz-department/sketch" to="/panel/apz-department/sketch/status/active/1" />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
