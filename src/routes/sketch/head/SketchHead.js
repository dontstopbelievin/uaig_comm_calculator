import React from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import Loader from 'react-loader-spinner';
import $ from 'jquery';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';
import saveAs from 'file-saver';
import AllSketches from './AllSketches';
import ShowSketch from './ShowSketch';

export default class Head extends React.Component {
    render() {
        return (
            <div className="content container body-content">
                <div>
                    <div>
                        <Switch>
                            <Route path="/panel/head/sketch/status/:status/:page" exact render={(props) =>(
                                <AllSketches {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Route path="/panel/head/sketch/show/:id" exact render={(props) =>(
                                <ShowSketch {...props} breadCrumbs={this.props.breadCrumbs.bind(this)} />
                            )} />
                            <Redirect from="/panel/head/sketch" to="/panel/head/sketch/status/active/1" />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}
