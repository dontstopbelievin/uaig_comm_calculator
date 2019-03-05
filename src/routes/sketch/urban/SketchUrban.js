import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import ReactQuill from 'react-quill';
import saveAs from 'file-saver';
import AllSketch from './AllSketch';
import ShowMap from './ShowMap';
import ShowSketch from './ShowSketch';

export default class SketchUrban extends React.Component {
    render() {
        return (
            <div className="content container body-content">
                <div>
                    <div>
                        <Switch>
                            <Route path="/panel/urban/sketch/status/:status/:page" exact render={(props) =>(
                                <AllSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Route path="/panel/urban/sketch/show/:id" exact render={(props) =>(
                                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Redirect from="/panel/urban/sketch" to="/panel/urban/sketch/status/active/1" />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
