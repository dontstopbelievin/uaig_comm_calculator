import React, { Component } from 'react';
import * as esriLoader from 'esri-loader';
import '../assets/css/style.css';

export default class Map2dView extends Component {
  createMap(element){
    //console.log(this.refs)
    esriLoader.loadModules(
      ["esri/views/MapView",
      "esri/WebMap",
      "esri/widgets/LayerList",
      "esri/layers/FeatureLayer",
      "esri/widgets/Search",
      "dojo/domReady!"],
      (MapView, WebMap, LayerList, FeatureLayer, Search) => {


      var webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: "6bb8a51c86c04b35adca0d9fc8d3a155"
        }
      });

      /************************************************************
       * Set the WebMap instance to the map property in a MapView.
       ************************************************************/
      var view = new MapView({
        map: webmap,
        center: [76.886, 43.250], // lon, lat
        scale: 10000,
        container: element
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
      esriLoader.loadScript(
        err => {
          if(err) {
            console.log(err);
          } else {
            this.createMap(element);
          }
        },
        {
          url: "https://js.arcgis.com/4./"
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