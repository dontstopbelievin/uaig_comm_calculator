import React from 'react';
import ReactDOM from 'react-dom';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';
import '../../assets/css/citizen.css';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../../languages/header.json';
import ReactHintFactory from 'react-hint'
import '../../assets/css/reacthint.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import saveAs from 'file-saver';



export default class ShowMap extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMap = this.toggleMap.bind(this);
  }

  toggleMap(value) {
    this.props.mapFunction(value);
  }

  changeState(name, value) {
    var data = {
      target: {name: name, value: value}
    };

    this.props.changeFunction(data);
  }

  saveCoordinates() {
    this.changeState('projectAddressCoordinates', $('#coordinates').html());

    this.props.hasCoordinates(true);

    if (window.confirm('Местоположение отмечено. Закрыть карту?')) {
      this.toggleMap(false);
    }
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    var oldPoint = [];
    var withPoint = this.props.point;
    var coordinates = this.props.coordinates;

    return (
      <div>
        {withPoint ?
          <div className="row">
            <div className="col-sm-6">
              <h5 className="block-title-2 mt-0 mb-3">Карта</h5>
            </div>
            <div className="col-sm-6">
              <div className="pull-right">
                <button type="button" className="btn btn-outline-success mr-1" onClick={() => this.saveCoordinates()}>Сохранить</button>
                <button type="button" className="btn btn-outline-secondary" onClick={this.toggleMap.bind(this, false)}>Закрыть карту</button>
              </div>
            </div>
          </div>
          :
          <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        }
        <div id="coordinates" style={{display: 'none'}}></div>
        <div className="col-md-12 viewDiv">
          <EsriLoaderReact options={options}
            modulesToLoad={[
              'esri/views/MapView',

              'esri/widgets/LayerList',

              'esri/WebScene',
              'esri/layers/FeatureLayer',
              'esri/layers/TileLayer',
              'esri/widgets/Search',
              'esri/WebMap',
              'esri/geometry/support/webMercatorUtils',
              'dojo/dom',
              "esri/Map",
              "esri/layers/MapImageLayer",
              'esri/Graphic',
              'esri/config',
              'dojo/domReady!'
            ]}

            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Map,
              MapImageLayer, Graphic, esriConfig], containerNode}) => {
              esriConfig.portalUrl = "https://gis.uaig.kz/arcgis";
              var map = new WebMap({
                basemap: "streets",
                portalItem: {
                  id: "b5a3c97bd18442c1949ba5aefc4c1835"
                }
              });
              /*var map = new Map("map",{
                scale: 250000,
                maxScale: 500,
                minScale: 250000,
                slider:false
              });
              var layer, layer2;
              layer = new MapImageLayer("http://gis.uaig.kz/server/rest/services/Map2d/Базовая_карта_MIL1/MapServer");
              layer2 = new MapImageLayer("http://gis.uaig.kz/server/rest/services/Map2d/объекты_города/MapServer");
              map.layers.add(layer2);
              map.layers.add(layer);*/

              if (coordinates) {
                var coordinatesArray = coordinates.split(", ");

                var view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])],
                  scale: 10000
                });

                var point = {
                  type: "point",
                  longitude: parseFloat(coordinatesArray[0]),
                  latitude: parseFloat(coordinatesArray[1])
                };

                var markerSymbol = {
                  type: "simple-marker",
                  color: [226, 119, 40],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                var pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                view.graphics.add(pointGraphic);
              } else {
                  view = new MapView({
                  container: containerNode,
                  map: map,
                  center: [76.886, 43.250],
                  scale: 10000
                });
              }

              if (withPoint) {
                view.on("click", showCoordinates);

                function showCoordinates(evt) {
                  var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                  dom.byId("coordinates").innerHTML = mp.x.toFixed(5) + ", " + mp.y.toFixed(5);

                  var point = {
                    type: "point",
                    longitude: mp.x.toFixed(5),
                    latitude: mp.y.toFixed(5)
                  };

                  var markerSymbol = {
                    type: "simple-marker",
                    color: [226, 119, 40],
                    outline: {
                      color: [255, 255, 255],
                      width: 2
                    }
                  };

                  var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                  });

                  view.graphics.remove(oldPoint);
                  view.graphics.add(pointGraphic);

                  oldPoint = pointGraphic;
                }
              }

              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    //url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer/14",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">`+"{cadastre_number}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Код административного района:</td>  <td class="attrValue">`+"{id_admraiona}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Адрес:</td>  <td class="attrValue">`+"{address}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Наименование</td>  <td class="attrValue">`+"{name}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Площадь жил. помещения:</td>  <td class="attrValue">`+"{zhil_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Год постройки:</td>  <td class="attrValue">`+"{year_of_foundation}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["kad_n"],
                  displayField: "kad_n",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Кадастровый номер",
                  placeholder: "введите кадастровый номер",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                },{
                  featureLayer: new FeatureLayer({
                    //url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer/27",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">`+"{cadastre_n}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Район:</td>  <td class="attrValue">`+"{id_admraio}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Улица:</td>  <td class="attrValue">`+"{street_nam}"+"{number_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName"> Наименование объекта</td>  <td class="attrValue">`+"{name}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Заказчик:</td>  <td class="attrValue">`+"{zakazchik}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["cadastre_n"],
                  displayField: "cadastre_n",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Кадастровый номер(Акт приемки)",
                  placeholder: "введите кадастровый номер",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                },
                {
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer/14",
                    popupTemplate: {
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);width:100%"><td class="attrName">Адресный массив:</td>  <td class="attrValue">`+"{id_adr_massive}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Количество этажей:</td>  <td class="attrValue">`+"{floor}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Год постройки:</td>  <td class="attrValue">`+"{year_of_foundation}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">`+"{obsch_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Объем здания, м3:</td>  <td class="attrValue">`+"{volume_build}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Площадь жил. помещения:</td>  <td class="attrValue">`+"{zhil_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Площадь застройки, м2:</td>  <td class="attrValue">`+"{zastr_area}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Наименование первичной улицы:</td>  <td class="attrValue">`+"{street_name_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Основной номер дома:</td>  <td class="attrValue">`+"{number_1}"+`</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Второстепенный номер дома:</td>  <td class="attrValue">`+"{number_2}"+`</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["street_name_1","id_adr_massive", "address"],
                  displayField: "street_name_1" ,
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Здания и сооружения",
                  placeholder: "введите улицу",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                }]
              });

              view.when( function(callback){
                var layerList = new LayerList({
                  view: view
                });
                console.log(view.allLayerViews);

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
      </div>
    )
  }
}
