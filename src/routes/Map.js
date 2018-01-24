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
      <div className="viewDiv"> 
        <EsriLoaderReact options={options} 
          modulesToLoad={[
            'esri/views/SceneView',
            
            'esri/widgets/LayerList',

            'esri/WebScene',
            'esri/layers/FeatureLayer',
            'esri/widgets/Search',
            'esri/Map',
            'esri/widgets/ScaleBar',
            'dojo/domReady!'
          ]}    
          
          onReady={({loadedModules: [SceneView, LayerList, WebScene, FeatureLayer, Search, Map, ScaleBar], containerNode}) => {
            var map = new WebScene({
              portalItem: { // autocasts as new PortalItem()
                id: "82d49bed42ea4de9a7a20ca904e02cc5"
              },  
            });
          
            var view = new SceneView({
              container: containerNode,
              map: map,
              center: [76.923 , 43.232], // lon, lat
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
              // var layerList = new LayerList({
              //   view: view
              // });

              // Add the search widget to the top right corner of the view
              view.ui.add(searchWidget, {
                position: "top-right"
              });

              // Add widget to the bottom right corner of the view
              //view.ui.add(layerList, "bottom-right");

            }, function(error) {
              console.log('MapView promise rejected! Message: ', error);
            });
          }}
        />
      </div>
    )
  }
}