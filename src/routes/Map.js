import React, { Component } from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
import '../assets/css/style.css';

export default class MapView extends Component {
  componentWillMount() {
    //console.log("GuestComponent will mount");
  }

  componentDidMount() {
    //console.log("GuestComponent did mount");
  }

  componentWillUnmount() {
    //console.log("GuestComponent will unmount");
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
      <div>
        <div class="row" id="newWebApp">    
          <iframe height="700" width="100%" frameborder="0" scrolling="0" marginheight="0" marginwidth="0" src="https://uaig.maps.arcgis.com/apps/webappviewer3d/index.html?id=2f69b9af3d2a44b98580f497dc9216cc">
          </iframe>
        </div>
      </div>
    )
  }
}