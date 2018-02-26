import React, { Component } from 'react';
//import * as esriLoader from 'esri-loader';
//import EsriLoaderReact from 'esri-loader-react';
import '../assets/css/style.css';

export default class Map2dView extends Component {
  componentWillMount() {
    //console.log("Map2dViewComponent will mount");
  }

  componentDidMount() {
    //console.log("Map2dViewComponent did mount");
  }

  componentWillUnmount() {
    //console.log("Map2dViewComponent will unmount");
  }

  render() {
    // const options = {
    //   url: 'https://js.arcgis.com/4.6/'
    // };

    return (
      <div>
        <div id="newWebApp">    
          <iframe height="700" width="100%" frameborder="0" scrolling="0" marginheight="0" marginwidth="0" src="https://uaig.maps.arcgis.com/apps/webappviewer/index.html?id=d94c6cd9142e4a4da54cfbf0b7207f76"></iframe>
        </div>
      </div>
    )
  }
}