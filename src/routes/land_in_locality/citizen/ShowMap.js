import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-serializejson';

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

  saveCoordinates(address) {
    this.changeState('landAddressCoordinates', $('#coordinates').html());

    this.changeState('landAddress', address);

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
    var address = '';
    var coordinates = this.props.coordinates;

    return (
      <div>
        {withPoint ?
          <div className="row">
            <div className="col-sm-4">
              <h5 className="block-title-2 mt-0 mb-3">Карта</h5>
            </div>
            <div className="col-sm-8">
              <div className="pull-right">
                <button type="button" className="btn btn-outline-success mr-1" onClick={() => this.saveCoordinates(address)}>Сохранить местоположение</button>
                <button type="button" className="btn btn-outline-secondary" onClick={this.toggleMap.bind(this, false)}>Закрыть карту</button>
              </div>
            </div>
          </div>
          :
          <h5 className="block-title-2 mt-5 mb-3">Карта</h5>
        }
        <div id="coordinates" style={{display: 'none'}}></div>
        <div id="viewDivCrusor" className="col-md-12 viewDiv">
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
              "esri/tasks/IdentifyTask",
              "esri/tasks/support/IdentifyParameters",
              "esri/tasks/FindTask",
              "esri/tasks/support/FindParameters",
              'dojo/domReady!'
            ]}

            onReady={({loadedModules: [MapView, LayerList, WebScene, FeatureLayer, TileLayer, Search, WebMap, webMercatorUtils, dom, Map,
              MapImageLayer, Graphic, esriConfig, IdentifyTask, IdentifyParameters, FindTask, FindParameters], containerNode}) => {

              var identifyTask, params;
              esriConfig.portalUrl = "https://gis.uaig.kz/arcgis";
              var map = new WebMap({
                basemap: "streets",
                portalItem: {
                  id: "b5a3c97bd18442c1949ba5aefc4c1835"
                }
              });

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

              if(this.props.kadastr_number){
                var find = new FindTask({
                  url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer"
                });
                var params = new FindParameters({
                  layerIds: [27, 14],
                  searchFields: ['cadastre_n', 'cadastre_number'],
                  returnGeometry: true
                });
                params.searchText = this.props.kadastr_number;
                find.execute(params).then(showResults);
                function showResults(response) {
                  return response.results.map(function(result) {
                    //console.log(result.feature);
                    switch (result.layerName) {
                      case 'Здания и сооружения':
                          console.log(result.feature.attributes['полный адрес'].trim());
                          address = result.feature.attributes['полный адрес'].trim();
                          showPoint(result.feature.geometry.centroid.latitude, result.feature.geometry.centroid.longitude);
                          break;
                      case 'Акт приемки':
                          console.log(result.feature.attributes['street_nam'].trim());
                          address = result.feature.attributes['street_nam'].trim();
                          showPoint(result.feature.geometry.centroid.latitude, result.feature.geometry.centroid.longitude);
                          break;
                      default:
                          console.log('Не найден');
                          address = 'Не найден';
                    }
                    return address;
                  });
                }
                function showPoint(latitude, longitude){
                  view.center = [longitude.toFixed(5), latitude.toFixed(5)];
                  dom.byId("coordinates").innerHTML = longitude.toFixed(5) + ", " + latitude.toFixed(5);

                  var point = {
                    type: "point",
                    longitude: longitude.toFixed(5),
                    latitude: latitude.toFixed(5)
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

              if (withPoint) {
                view.on("click", showCoordinates);

                // Create identify task for the specified map service
                identifyTask = new IdentifyTask('https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer');

                // Параметры для поиска
                params = new IdentifyParameters();
                params.tolerance = 3; //Дистанция от точки клика в пикселях
                params.layerIds = [14]; //Номера слоев где искать
                params.layerOption = "top"; // искать на верхних слоях (IdentifyParameters.LAYER_OPTION_VISIBLE;)
                params.width = view.width; // Размеры видимой карты
                params.height = view.height;

                function showCoordinates(event) {
                  var mp = webMercatorUtils.webMercatorToGeographic(event.mapPoint);
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

                  // Set the geometry to the location of the view click
                  params.geometry = event.mapPoint;
                  params.mapExtent = view.extent;

                  identifyTask.execute(params).then(function(response) {

                    var results = response.results;

                    return results.map(function(result) {

                      var feature = result.feature;
                      var layerName = result.layerName;

                      feature.attributes.layerName = layerName;
                      if (layerName === 'Здания и сооружения') {
                        // console.log(feature.attributes['полный адрес'].trim());
                        address = feature.attributes['полный адрес'].trim();
                      }
                      return feature;
                    });
                  });

                }
              }

              var searchWidget = new Search({
                view: view,
                sources: [{
                  featureLayer: new FeatureLayer({
                    url: "https://gis.uaig.kz/server/rest/services/Map2d/объекты_города3/MapServer/27",
                    popupTemplate: { // autocasts as new PopupTemplate()
                      title: `<table>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Кадастровый номер:</td>  <td class="attrValue">{cadastre_n}</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Район:</td>  <td class="attrValue">{id_admraio}</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Улица:</td>  <td class="attrValue">{street_nam}"+"{number_1}</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName"> Наименование объекта</td>  <td class="attrValue">{name}</td></tr>
                        <tr style="background-color: rgba(0, 0, 255, 0.05);"><td class="attrName">Общая площадь:</td>  <td class="attrValue">{obsch_area}</td></tr>
                        <tr style="background-color: rgba(0, 255, 0, 0.05);"><td class="attrName">Заказчик:</td>  <td class="attrValue">{zakazchik}</td></tr>
                      </table>`
                    }
                  }),
                  searchFields: ["cadastre_n"],
                  displayField: "cadastre_n",
                  exactMatch: false,
                  outFields: ["*"],
                  name: "Кадастровый номер(Акт приемки)",
                  placeholder: "Введите кадастровый номер",
                  maxResults: 6,
                  maxSuggestions: 6,
                  enableSuggestions: true,
                  minCharacters: 0
                }]
              });

              view.when( function(callback){

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
