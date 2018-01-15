import React, { Component } from 'react';
//import * as esriLoader from 'esri-loader';
import EsriLoaderReact from 'esri-loader-react';
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
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
      <div className="viewDiv"> 
        <EsriLoaderReact options={options} 
          modulesToLoad={[
            'esri/views/MapView',
            'esri/WebMap',
            
            'esri/widgets/LayerList',

            'esri/layers/FeatureLayer',
            'esri/widgets/Search',
            'dojo/domReady!'
          ]}    
          
          onReady={({loadedModules: [MapView, WebMap, LayerList, FeatureLayer, Search], containerNode}) => {
            var webmap = new WebMap({
              portalItem: { // autocasts as new PortalItem()
                id: "6bb8a51c86c04b35adca0d9fc8d3a155"
              }
            });

            /************************************************************
             * Set the WebMap instance to the map property in a MapView.
             ************************************************************/
            var view = new MapView({
              container: containerNode,
              map: webmap,
              center: [76.886, 43.250], // lon, lat
              scale: 10000
            });
            
            var searchWidget = new Search({
              view: view,
              sources: [{
                featureLayer: new FeatureLayer({
                  url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                  popupTemplate: { // autocasts as new PopupTemplate()
                    title: "Кадастровый номер: {cadastral_number} </br> Назначение: {function} <br/> Вид собственности: {ownership}"
                  }
                }),
                searchFields: ["cadastral_number"],
                displayField: "cadastral_number",
                exactMatch: false,
                outFields: ["cadastral_number", "function", "ownership"],
                name: "Зарегистрированные государственные акты",
                placeholder: "Кадастровый поиск"
              }]
            });
  
            view.when( function(callback){
              var layerList = new LayerList({
                view: view
              });

              // Add the search widget to the top right corner of the view
              view.ui.add(searchWidget, {
                position: "top-right"
              });

              // Add widget to the bottom right corner of the view
              view.ui.add(layerList, "bottom-right");

            }, function(error) {
              console.log('MapView promise rejected! Message: ', error);
            });
          }}
        />
      </div>
    )
  }
}