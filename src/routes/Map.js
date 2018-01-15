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
      "esri/widgets/ScaleBar",
      "dojo/domReady!"],
      (SceneView, LayerList, WebScene, FeatureLayer, Search, Map, ScaleBar) => {

      var map = new WebScene({
        portalItem: { // autocasts as new PortalItem()
          id: "82d49bed42ea4de9a7a20ca904e02cc5"
        },
        
      });

      // var cityBorder = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%93%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Граница города"
      // });
      // map.add(cityBorder);

      // var flGosAkts = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Гос акты"
      // });
      // map.add(flGosAkts);

      // var flRedLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Красные линии"
      // });
      // map.add(flRedLines);

      // var templateSecond = {
      //       title: "Здание",
      //       content: "<table>" +
      //       "<tr><td>Название: </td><td>{Name}</td></tr>" +
      //       "<tr><td>Адрес: </td><td>{Notes}</td></tr>" +
      //       "<tr><td>Время работы: </td><td>{Поле}</td></tr>" +
      //       "<tr><td>Дополнительная информация: </td><td>{Поле1}</td></tr>" +
      //       "<tr><td>Организации в здании: </td><td>{Поле2}</td></tr>",
      //       fieldInfos: [{
      //           fieldName: "Name",
      //           format: {
      //               digitSeparator: true, // Use a comma separator for large numbers
      //               places: 0 // Sets the number of decimal places to 0 and rounds up
      //           }
      //       },{
      //           fieldName: "Notes",
      //           format: {
      //               digitSeparator: true, // Use a comma separator for large numbers
      //               places: 0 // Sets the number of decimal places to 0 and rounds up
      //           }
      //       }, {
      //           fieldName: "Поле",
      //           format: {
      //               digitSeparator: true,
      //               places: 0
      //           }
      //       },
      //       {
      //           fieldName: "Поле1",
      //           format: {
      //               digitSeparator: true,
      //               places: 0
      //           }
      //       }, {
      //           fieldName: "Поле2"
      //       }]
      //   };

      // //паспортные данные
      // var flPassport = new FeatureLayer({
      //   //portalItem: {  // autocasts as esri/portal/PortalItem
      //     //id: "e8552e54d00b4daa9795301a8f58b728"
      //   //},
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/ArcGIS/rest/services/Info3d_WFL1/FeatureServer/0",
      //   outFields: ["*"],
      //   title: "Паспортные данные",
      //   popupTemplate: templateSecond
      // });
      // map.add(flPassport);

      // var freePowerZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%BE%D0%BD%D0%B0_%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%BD%D1%8B%D1%85_%D0%BC%D0%BE%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9/FeatureServer",
      //   outFields: ["*"],
      //   title: "Зона свободных мощностей"
      // });
      // map.add(freePowerZone);

      // var peregGolZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BF%D0%B5%D1%80%D0%B5%D0%B3%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D1%85_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BD%D1%8B%D1%85/FeatureServer",
      //   outFields: ["*"],
      //   title: "Зона перегруженных головных"
      // });
      // map.add(peregGolZone);

      // var ponStanZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BF%D0%BE%D0%BD%D0%B8%D0%B7%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85_%D1%81%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%B9/FeatureServer",
      //   outFields: ["*"],
      //   title: "Зона понизительных станций"
      // });
      // map.add(ponStanZone);

      // var jilMass = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%96%D0%B8%D0%BB%D1%8B%D0%B5_%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Жилые массивы"
      // });
      // map.add(jilMass);

      // var aktyVybora = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%90%D0%BA%D1%82%D1%8B_%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Акты выбора"
      // });
      // map.add(aktyVybora);

      // var vodRes = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%BE%D0%BD%D0%B0_%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D0%B2%D0%BE%D0%B4%D0%BD%D1%8B%D0%BC%D0%B8_%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D0%B0%D0%BC%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Зона обеспеченности водными ресурсами"
      // });
      // map.add(vodRes);

      // var adminRegionBorder = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5_%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%D0%BE%D0%B2/FeatureServer",
      //   outFields: ["*"],
      //   title: "Административные границы районов"
      // });
      // map.add(adminRegionBorder);

      // var bridgeAndRoadLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9C%D0%BE%D1%81%D1%82%D1%8B_%D0%B8_%D0%BF%D1%83%D1%82%D0%B5%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Мосты и путепроводы"
      // });
      // map.add(bridgeAndRoadLines);

      // var buildingAndConstruction = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B8_%D1%81%D0%BE%D0%BE%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Здания и сооружения"
      // });
      // map.add(buildingAndConstruction);

      // var constructionOfElectroSys = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A1%D0%BE%D0%BE%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Сооружения системы электроснабжения"
      // });
      // map.add(constructionOfElectroSys);

      // var functionalZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%B7%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5/FeatureServer",
      //   outFields: ["*"],
      //   title: "Функциональное зонирование"
      // });
      // map.add(functionalZone);

      // var registeredGosAkts = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Зарегистрированные государственные акты"
      // });
      // map.add(registeredGosAkts);

      // var constructionOfEnergySys = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A1%D0%BE%D0%BE%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B_%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Сооружения системы энергоснабжения"
      // });
      // map.add(constructionOfEnergySys);

      // var hydroObj = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D1%8B_%D0%B3%D0%B8%D0%B4%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Объекты гидрографии"
      // });
      // map.add(hydroObj);

      // var cemetery = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9A%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Кладбища"
      // });
      // map.add(cemetery);

      // var kurgany = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9A%D1%83%D1%80%D0%B3%D0%B0%D0%BD%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Курганы"
      // });
      // map.add(kurgany);

      // var alatauNatPark = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%98%D0%BB%D0%B5_%D0%90%D0%BB%D0%B0%D1%82%D0%B0%D1%83%D1%81%D0%BA%D0%B8%D0%B9_%D0%BD%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BF%D0%B0%D1%80%D0%BA/FeatureServer",
      //   outFields: ["*"],
      //   title: "Иле-Алатауский национальный парк"
      // });
      // map.add(alatauNatPark);

      // var secureGasLineZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D0%B3%D0%B0%D0%B7%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Охранная зона газопровода"
      // });
      // map.add(secureGasLineZone);

      // var secureTeplotrassaZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D1%82%D0%B5%D0%BF%D0%BB%D0%BE%D1%82%D1%80%D0%B0%D1%81%D1%81%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Охранная зона теплотрассы"
      // });
      // map.add(secureTeplotrassaZone);

      // var secureWaterLineZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Охранная зона водопровода"
      // });
      // map.add(secureWaterLineZone);

      // var techRazlomy = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A2%D0%B5%D0%BA%D1%82%D0%BE%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5_%D1%80%D0%B0%D0%B7%D0%BB%D0%BE%D0%BC%D1%8B/FeatureServer",
      //   outFields: ["*"],
      //   title: "Тектонические разломы"
      // });
      // map.add(techRazlomy);

      // var proezChast = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9F%D1%80%D0%BE%D0%B5%D0%B7%D0%B6%D0%B0%D1%8F_%D1%87%D0%B0%D1%81%D1%82%D1%8C/FeatureServer",
      //   outFields: ["*"],
      //   title: "Проезжая часть"
      // });
      // map.add(proezChast);

      // var secureWaterZone = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%92%D0%BE%D0%B4%D0%BE%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%BE%D0%BD%D0%B0/FeatureServer",
      //   outFields: ["*"],
      //   title: "Водоохранная зона"
      // });
      // map.add(secureWaterZone);

      // var greening = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D0%B7%D0%B5%D0%BB%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5/FeatureServer",
      //   outFields: ["*"],
      //   title: "Озеленение"
      // });
      // map.add(greening);

      // var undergroundElectroCable = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D0%B8_%D0%BF%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%BD%D1%8B%D0%B5/FeatureServer",
      //   outFields: ["*"],
      //   title: "Электрокабели подземные"
      // });
      // map.add(undergroundElectroCable);

      // var electroLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9B%D0%B8%D0%BD%D0%B8%D0%B8_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Линии электроснабжения"
      // });
      // map.add(electroLines);

      // var gasLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%B3%D0%B0%D0%B7%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Трубопроводы газоснабжения"
      // });
      // map.add(gasLines);

      // var heatLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D1%82%D0%B5%D0%BF%D0%BB%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Трубопроводы теплоснабжения"
      // });
      // map.add(heatLines);

      // var liniearObfOfHydro = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9B%D0%B8%D0%BD%D0%B5%D0%B9%D0%BD%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82_%D0%B3%D0%B8%D0%B4%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Линейный объект гидрографии"
      // });
      // map.add(liniearObfOfHydro);

      // var trainRoads = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%96%D0%B5%D0%BB%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Железные дороги"
      // });
      // map.add(trainRoads);

      // var planedRedLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D1%83%D0%B5%D0%BC%D1%8B%D0%B5_%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Проектируемые красные линии"
      // });
      // map.add(planedRedLines);

      // var sewageLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Трубопроводы канализации"
      // });
      // map.add(sewageLines);

      // var osevyeStreetLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D0%A1%D0%B5%D0%B2%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8_%D1%83%D0%BB%D0%B8%D1%86/FeatureServer",
      //   outFields: ["*"],
      //   title: "Оcевые линии улиц"
      // });
      // map.add(osevyeStreetLines);

      // var osevyeStreetLines1 = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%81%D0%B5%D0%B2%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8_%D1%83%D0%BB%D0%B8%D1%86_1_%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C/FeatureServer",
      //   outFields: ["*"],
      //   title: "Осевые линии улиц уровень 1"
      // });
      // map.add(osevyeStreetLines1);

      // var osevyeStreetLines2 = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%81%D0%B5%D0%B2%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8_%D1%83%D0%BB%D0%B8%D1%86_2_%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C/FeatureServer",
      //   outFields: ["*"],
      //   title: "Осевые линии улиц уровень 2"
      // });
      // map.add(osevyeStreetLines2);

      // var osevyeStreetLines3 = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D1%81%D0%B5%D0%B2%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8_%D1%83%D0%BB%D0%B8%D1%86_%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C_3/FeatureServer",
      //   outFields: ["*"],
      //   title: "Осевые линии улиц уровень 3"
      // });
      // map.add(osevyeStreetLines3);

      // var streetNaming = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9D%D0%B0%D0%B4%D0%BF%D0%B8%D1%81%D0%B8_%D1%83%D0%BB%D0%B8%D1%86/FeatureServer",
      //   outFields: ["*"],
      //   title: "Надписи улиц"
      // });
      // map.add(streetNaming);

      // var airConnectionLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%92%D0%BE%D0%B7%D0%B4%D1%83%D1%88%D0%BD%D1%8B%D0%B5_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B8_%D1%81%D0%B2%D1%8F%D0%B7%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Воздушные линии связи"
      // });
      // map.add(airConnectionLines);

      // var stolbyAirElectroLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A1%D1%82%D0%BE%D0%BB%D0%B1%D1%8B_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%88%D0%BD%D1%8B%D1%85_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B9_%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87/FeatureServer",
      //   outFields: ["*"],
      //   title: "Столбы воздушных линий электропередач"
      // });
      // map.add(stolbyAirElectroLines);

      // var waterLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%A2%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D1%8B_%D0%B2%D0%BE%D0%B4%D0%BE%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F/FeatureServer",
      //   outFields: ["*"],
      //   title: "Трубопроводы водоснабжения"
      // });
      // map.add(waterLines);

      // var oporyAirConnectionLines = new FeatureLayer({
      //   url: "https://services8.arcgis.com/Y15arG10A8lU6n2f/arcgis/rest/services/%D0%9E%D0%BF%D0%BE%D1%80%D1%8B_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%88%D0%BD%D1%8B%D1%85_%D0%BB%D0%B8%D0%BD%D0%B8%D0%B9_%D1%81%D0%B2%D1%8F%D0%B7%D0%B8/FeatureServer",
      //   outFields: ["*"],
      //   title: "Опоры воздушных линий связи"
      // });
      // map.add(oporyAirConnectionLines);

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
            url: "https://gis.uaig.kz/server/rest/services/Hosted/%D0%97%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B0%D0%BA%D1%82%D1%8B/FeatureServer",
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

      // Add the search widget to the top right corner of the view
      view.ui.add(searchWidget, {
        position: "top-right"
      });
      
      view.then(function() {
        var layerList = new LayerList({
          view: view
        });

        // Add widget to the bottom right corner of the view
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