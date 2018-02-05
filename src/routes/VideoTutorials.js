import React from 'react';
import $ from 'jquery';
import { NavLink } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import {ru, kk} from '../languages/header.json';
import EsriLoaderReact from 'esri-loader-react';

let e = new LocalizedStrings({ru,kk});

export default class VideoTutorials extends React.Component {

    constructor() {
        super();
        (localStorage.getItem('lang')) ? e.setLanguage(localStorage.getItem('lang')) : e.setLanguage('ru');

        this.state = {
            tokenExists: false,
            rolename: ""
        }
    }

  componentDidMount() {
    $('#video_list .list-group-item').click(function() {
      var state = $(this).hasClass('active');

      $('#video_list .list-group-item').removeClass('active');
      $('.video_block').slideUp('fast');
      $('.slide_icon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');

      if (!state) {
        $(this).addClass('active');
        $($(this).attr('href')).slideDown('fast');
        $('.slide_icon', this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    });
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
        <div>
    <div className="container navigational_price">
      <NavLink to="/" replace className="">{e.hometwo}</NavLink> / {e.tutorials}
    </div>
      <div className="content container video_tutorials-plan-page">
        <div className="card">
          <div className="card-header">
          <h4 className="mb-0">Пример работы</h4></div>
          <div className="card-body">
            <div className="list-group" id="video_list">
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab1">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    2D сцена с ветром
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab1" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windFlow2D" width="500" height="250" src="https://www.youtube.com/embed/-BPqC07h3bc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>На сцене для 2д анализа, показано движение ветра, который проходит через отдельный микрорайон. Отчетливо показано как ведет себя ветер проходя через жилой массив: изменение скорости и завивания. Данный вид сцены поможет показать где и как нужно строить здания так, чтобы ветер свободно циркулировал и в свою очередь не образовывал смог.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab2">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    3D сцена с ветром
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab2" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windFlow3D" width="500" height="250" src="https://www.youtube.com/embed/2sPBYBLq8gQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>В видео показано движение ветра в отдельном микрорайоне в 3д сцене. На нем видно, как воздушные массы огибают здания образуя сквозняки либо затишья, сталкиваясь с другими зданиями. Также продемонстрирована ветровая нагрузка, которую оказывает ветер на здания при скорости 10м\с.  Различия в нагрузке можно определить визуально, так как имеется цветовой спектр, которому соответствует определенное значение.  На шкале за 0 берется значение давления при скорости ветра 10м\с.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab3">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    2D сцена с давлением
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab3" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="windLoad" width="500" height="250" src="https://www.youtube.com/embed/_vu65k6aLIQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>Данная сцена нам показывает, как распределяется ветровая нагрузка при скорости 10м\с. На ней мы можем увидеть, что здания в оранжевой и желтой зонах испытывают наибольшую нагрузку при ветре. И мы можем сказать, что при неблагоприятных погодных условиях ветер может нанести повреждения на конструкции здания. Те здания, которые находятся в зелёной зоне, не будут получать ущерба при сильном ветре. В легенде за 0 была взята отметка давления при скорости 10м\с., и мы видим, что максимально возможная отметка давления является 168, а наименьшая -172.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab4">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    3D модель города Алматы
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab4" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-sm-6">
                    <iframe title="almaty3D" width="500" height="250" src="https://www.youtube.com/embed/bjhCE7sKr8s" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                  <div className="col-sm-6">
                    <p>На сцене изображена 3д модель города Алматы, полученного на основе данных С БПЛА компании ТОО «KazAeroSpace», и произведен ортофотоплан. Он имеет разрешение 10 см, что является довольно высоким качеством на текущий момент.</p>
                  </div>
                </div>
              </div>
              <a className="list-group-item list-group-item-action" data-toggle="list" href="#tab5">
                <i className="glyphicon glyphicon-play"></i>
                <div className="bmd-list-group-col">
                  <p className="list-group-item-heading pointer mb-0">
                    BIM
                  </p>
                </div>
                <i className="slide_icon glyphicon glyphicon-chevron-down pull-xs-right pointer"></i>
              </a>
              <div className="video_block" id="tab5" style={{ display: 'none' }}>
                <div className="row">
                  <div className="col-md-12 viewDiv"> 
                    <EsriLoaderReact options={options} 
                      modulesToLoad={[
                        "esri/WebScene",
                        "esri/views/SceneView",
                        "esri/widgets/Legend",
                        "esri/widgets/LayerList",

                        "dojo/on",
                        "dojo/dom",
                        "dojo/domReady!"
                      ]}    
                      
                      onReady={({loadedModules: [WebScene, SceneView, Legend, LayerList, on, dom], containerNode}) => {
                        // load web scene from ArcGIS Online
                        var webScene = new WebScene({
                          portalItem: { // autocasts as new PortalItem()
                            id: "b1f8fb3b2fd14cc2a78728de108776b0"
                          }
                        });

                        // create the scene view
                        var view = new SceneView({
                          container: containerNode,
                          map: webScene,
                          environment: {
                            lighting: {
                              directShadowsEnabled: false
                            }
                          }
                        });

                        webScene.when(function() {

                        // the field containing the building is different for each layer
                        // buildingQuery defines the query corresponding to each layer in the web scene
                        var buildingQuery = {
                          "Building Wireframe": "BUILDINGID = 'Q'",
                          "Interior Space": "BUILDING = 'Q'",
                          "Walls": "BUILDINGKEY = 'Q'",
                          "Doors": "BUILDINGKEY = 'Q'"
                        };

                        // filter all layers in the web scene to contain only building Q
                        webScene.layers.forEach(function(layer) {
                          layer.definitionExpression = buildingQuery[layer.title];
                        });

                        // we will use the Interior Space layer many times, so we'll save it in a variable
                        var officeLayer = webScene.layers.find(function(l) {
                          return l.title === "Interior Space";
                        });

                        // the data set displays many types of offices, but below are the ones we want to display
                        var officeTypes = [
                          "Office-Executive", "Conference Room",
                          "Office-Single", "Office-Manager", "Office Cubicle"
                        ];

                        // function that calculates how many office types are currently shown and displays this in the legend
                        function displayOfficeTypes() {

                          // create the query on the officeLayer so that it respects its definitionExpression
                          var query = officeLayer.createQuery();
                          query.outFields = ["SPACETYPE"];

                          // query the officeLayer to calculate how many offices are from each type
                          officeLayer.queryFeatures(query)
                            .then(function(results) {

                              var typesCounter = {}; // counter for the office types defined in the officeTypes array
                              var othersCounter = 0; // counter for all the other office types

                              // count the types of all the features returned from the query
                              results.features.forEach(function(feature) {
                                var spaceType = feature.attributes.SPACETYPE;

                                if (typesCounter[spaceType]) {
                                  typesCounter[spaceType]++;
                                } else {
                                  typesCounter[spaceType] = 1;
                                }

                                if (officeTypes.indexOf(spaceType) === -1) {
                                  othersCounter++;
                                }

                              });

                              // to set the results in the legend, we need to modify the labels in the renderer
                              var newRenderer = officeLayer.renderer.clone();

                              officeTypes.forEach(function(value, i) {
                                newRenderer.uniqueValueInfos[i].label = value +
                                  ": " + (typesCounter[value] || 0) + " rooms";
                              });

                              newRenderer.defaultLabel = "Other types: " +
                                othersCounter + " rooms";

                              officeLayer.renderer = newRenderer;
                            });
                        }

                        // call the method to display the counts from each office type in the legend
                        displayOfficeTypes();

                        // function that will filter by the selected floor
                        function showFloors(evt) {

                          // retrieve the query stored in the selected value
                          var floorQuery = evt.target.value;

                          // update the definition expression of all layers except the wireframe layer
                          webScene.layers.forEach(function(layer) {
                            if (layer.title !== "Building Wireframe") {
                              layer.definitionExpression = buildingQuery[layer.title] +
                                " AND " + floorQuery;
                            }
                          });

                          // after the layers were filtered recalculate the counts of each office type
                          displayOfficeTypes();
                        }

                        on(dom.byId("floorSelect"), "change", showFloors);

                        // add a legend for the officeLayer
                        var legend = new Legend({
                          view: view,
                          layerInfos: [{
                            layer: officeLayer,
                            title: " "
                          }]
                        });

                        view.ui.add(legend, "bottom-right");

                        // Add a layer list to enable and disable the building wireframe
                        var layerList = new LayerList({
                          view: view
                        });

                        view.ui.add(layerList, {
                          position: "top-right"
                        });

                      });

                      view.ui.add(dom.byId("optionsDiv"), {
                        position: "top-left",
                        index: 0
                      });

                      }}
                    /> 
                    <div id="optionsDiv">
                      <div><b>Filter building by floor:</b>
                        <select id="floorSelect">
                          <option value="1=1">All</option>
                          <option value="FLOOR = '1'">1</option>
                          <option value="FLOOR = '2'">2</option>
                          <option value="FLOOR = '3'">3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p>Данные сцены предназначены для анализа в строительстве, экологических исследованиях и других сферах деятельности. Например, в том же градостроительстве данные модели помогут спроектировать расположение будущих зданий так чтобы воздух не задерживался в определенной зоне и не образовывался смог.  В строительстве проектировщик сможет с помощью данных моделей просмотреть на какие части им спроектированного здания будет оказана наибольшая ветровая нагрузка и в следствии сможет усилить свое здание в том или ином месте.</p>
          </div>
        </div>
      </div>
        </div>
    )
  }
}