import React, { Component } from 'react';
import * as esriLoader from 'esri-loader';
import '../assets/css/style.css';

export default class MapView extends Component {

  createMap(element){
    //console.log(this.refs)
    esriLoader.dojoRequire(
      ["esri/views/SceneView",
      "esri/widgets/LayerList",
      "esri/WebScene",
      "esri/layers/FeatureLayer",
      "esri/widgets/Search",
      "esri/Map",
      "dojo/domReady!"],
      (SceneView, LayerList, WebScene, FeatureLayer, Search, Map) => {

      var map = new WebScene({
        portalItem: { // autocasts as new PortalItem()
          id: "1d465802a5264d6696b521ad7f517fee"
        },
        
      });


      let view = new SceneView({
        container: element,
        map: map,
        center: [76.886, 43.250], // lon, lat
        scale: 10000
      });

      var searchWidget = new Search({
        view: view,
        sources: [{
          featureLayer: new FeatureLayer({
            portalItem: {
              id: "dcd7bef523324a149843a070fd857b11"
            },
            popupTemplate: { // autocasts as new PopupTemplate()
              title: "Кадастровый номер: {CADASTRAL_NUMBER} </br> Назначение: {FUNCTION_} <br/> Вид собственности: {OWNERSHIP}"
            }
          }),
          searchFields: ["CADASTRAL_NUMBER"],
          displayField: "CADASTRAL_NUMBER",
          exactMatch: false,
          outFields: ["CADASTRAL_NUMBER", "FUNCTION_", "OWNERSHIP"],
          name: "Зарегистрированные государственные акты",
          placeholder: "пример: 20311002074"
        }]
      });
      // Add the search widget to the top left corner of the view
      view.ui.add(searchWidget, {
        position: "top-right"
      });
      view.then(function() {
        var layerList = new LayerList({
          view: view
        });

        // Add widget to the top right corner of the view
        view.ui.add(layerList, "bottom-right");
      });
    });

  }

  onReference(element) {
    console.log('mounted');
    if(!esriLoader.isLoaded()) {
      esriLoader.bootstrap(
        err => {
          if(err) {
            console.log(err);
          } else {
            this.createMap(element);
          }
        },
        {
          url: "https://js.arcgis.com/4.5/"
        }
      );
    } else {
      this.createMap(element);
    }
  }

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
    //console.log("rendering the GuestComponent");
    //console.log(this.props.router);
    return (
      <div className="viewDiv" ref={this.onReference.bind(this)}>
        <div className="container">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }
}