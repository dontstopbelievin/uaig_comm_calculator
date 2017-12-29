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
          id: "7fb258f6ec9541fe8ac8247e8bd5f823"
        },
        
      });

      var flGosAkts = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
        outFields: ["*"],
        title: "Гос акты"
      });
      map.add(flGosAkts);

      var flRedLines = new FeatureLayer({
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
        outFields: ["*"],
        title: "Красные линии"
      });
      map.add(flRedLines);

      var templateSecond = {
            title: "Здание",
            content: "<table>" +
            "<tr><td>Название: </td><td>{Name}</td></tr>" +
            "<tr><td>Адрес: </td><td>{Notes}</td></tr>" +
            "<tr><td>Время работы: </td><td>{Поле}</td></tr>" +
            "<tr><td>Дополнительная информация: </td><td>{Поле1}</td></tr>" +
            "<tr><td>Организации в здании: </td><td>{Поле2}</td></tr>",
            fieldInfos: [{
                fieldName: "Name",
                format: {
                    digitSeparator: true, // Use a comma separator for large numbers
                    places: 0 // Sets the number of decimal places to 0 and rounds up
                }
            },{
                fieldName: "Notes",
                format: {
                    digitSeparator: true, // Use a comma separator for large numbers
                    places: 0 // Sets the number of decimal places to 0 and rounds up
                }
            }, {
                fieldName: "Поле",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            },
            {
                fieldName: "Поле1",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }, {
                fieldName: "Поле2"
            }]
        };
      //паспортные данные
      
      var flPassport = new FeatureLayer({
        //portalItem: {  // autocasts as esri/portal/PortalItem
          //id: "e8552e54d00b4daa9795301a8f58b728"
        //},
        url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/ArcGIS/rest/services/Info3d_WFL1/FeatureServer/0",
        outFields: ["*"],
        title: "Паспортные данные",
        popupTemplate: templateSecond
      });
      
      map.add(flPassport);

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
            url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
            popupTemplate: { // autocasts as new PopupTemplate()
              title: "Кадастровый номер: {CADASTRAL_NUMBER} </br> Назначение: {FUNCTION_} <br/> Вид собственности: {OWNERSHIP}"
            }
          }),
          searchFields: ["CADASTRAL_NUMBER"],
          displayField: "CADASTRAL_NUMBER",
          exactMatch: false,
          outFields: ["CADASTRAL_NUMBER", "FUNCTION_", "OWNERSHIP"],
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