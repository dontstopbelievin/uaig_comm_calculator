import React from 'react';
import * as esriLoader from 'esri-loader';

export default class Urban extends React.Component {
  constructor() {
    super();

    this.state = {
      apzListForms: []
    }

    this.getApzFormList = this.getApzFormList.bind(this);
  }

  test(e) {
    // console.log(e);
    var string = '';
    Object.keys(e).forEach(function(k){
      switch (k) {
         case "Applicant": 
          string += '<div class="row"><div class="col-6"><b>Заявитель</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "Address": 
          string += '<div class="row"><div class="col-6"><b>Адрес</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "Phone": 
          string += '<div class="row"><div class="col-6"><b>Телефон</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "Customer": 
          string += '<div class="row"><div class="col-6"><b>Заказчик</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "Designer": 
          string += '<div class="row"><div class="col-6"><b>Проектировщик</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "ProjectName": 
          string += '<div class="row"><div class="col-6"><b>Наименование Проекта</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "ProjectAddress": 
          string += '<div class="row"><div class="col-6"><b>Адрес Проекта</b>:</div> <div class="col-6">' + e[k]+'</div></div>'; 
          break;
         case "ApzDate":
          var jDate = new Date(e[k]);
          var curr_date = jDate.getDate();
          var curr_month = jDate.getMonth() + 1;
          var curr_year = jDate.getFullYear();
          var formated_date = curr_date + "-" + curr_month + "-" + curr_year;

          string += '<div class="row"><div class="col-6"><b>Дата заявки</b>:</div> <div class="col-6">' + formated_date+'</div></div>'; 
          break;
         default: break;
      }
    });
    string += '<div class="row" style="position: absolute; bottom: 10px;"><div class="col-md-12"><button class="btn btn-raised btn-success">Одобрить</button> <button class="btn btn-raised btn-danger">Отклонить</button></div></div>';
    document.getElementById("apz-detailed").innerHTML = string;
  }

  getApzFormList() {
    var token = sessionStorage.getItem('tokenInfo');
    var xhr = new XMLHttpRequest();
    xhr.open("get", window.url + "api/apz/region", true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        this.setState({ apzListForms: data });
      }
    }.bind(this);
    xhr.send();
  }

  createMap(element){
    console.log(this.refs)
    esriLoader.dojoRequire([
      "esri/views/SceneView",
      "esri/widgets/LayerList",
      "esri/WebScene",
      "esri/layers/FeatureLayer",
      "esri/layers/TileLayer",
      "esri/widgets/Search",
      "esri/Map",
      "dojo/domReady!"
    ], function(
      SceneView, LayerList, WebScene, FeatureLayer, TileLayer, Search, Map
    ) {

      //функциональное зонирование
      var flFunkZon = new FeatureLayer({
        portalItem: {  // autocasts as esri/portal/PortalItem
          id: "7dd6833628d34453939ed2c6fa514bb5"
        },
        outFields: ["*"],
        visible: true,
        title: "Функциональное зонирование"
      });
      
      
      //красные линии
      var flRedlines = new TileLayer({
        portalItem: {  // autocasts as esri/portal/PortalItem
          id: "f93a74c28c904666932f084d91719fdc"
        },
        outFields: ["*"],
        visible: true,
        title: "Красные линии"
      });
      var map = new Map({
        basemap: "dark-gray"
      });
      map.add(flFunkZon);
      map.add(flRedlines);
      var view = new SceneView({
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
    //console.log("UrbanComponent will mount");
    if(sessionStorage.getItem('tokenInfo')){
      var userRole = JSON.parse(sessionStorage.getItem('userRoles'))[0];
      this.props.history.replace('/' + userRole);
    }else {
      this.props.history.replace('/');
    }  
  }

  componentDidMount() {
    //console.log("UrbanComponent did mount");
    this.getApzFormList();
  }

  componentWillUnmount() {
    //console.log("UrbanComponent will unmount");
  }

  render() {
    //console.log("rendering the UrbanComponent");
    var apzListForms = this.state.apzListForms;
    return (
      <div className="container">
        <div className="row">
          <style dangerouslySetInnerHTML={{__html: ``}} />
            <div className="col-md-3">
                <h4 style={{textAlign: 'center'}}>Список заявлений</h4>
            </div>
            <div className="col-md-6">
                <h4 style={{textAlign: 'center'}}>Карта</h4>
            </div>
            <div className="col-md-3">
                <h4 style={{textAlign: 'center'}}>Информация</h4>
            </div>
        </div>
        <div className="row">
          <div className="col-md-3 apz-list card">
              {
                apzListForms.map(function(apzListForm, i){
                return(
                    <li key={i} onClick={this.test.bind(this, apzListForm)}>
                      {apzListForm.ProjectName}
                    </li>
                  )
                }.bind(this))
              }
          </div>
          <div className="col-md-6 apz-additional card" style={{paddingLeft:'0px', paddingRight:'0px'}}>
            <div className="col-md-12 well" style={{paddingLeft:'0px', paddingRight:'0px', height:'500px', width:'100%'}}>
                <div className="viewDivUrban" ref={this.onReference.bind(this)}>
                  <div className="container">
                    <p>Загрузка...</p>
                  </div>
                </div>
            </div>
            {/*<button class="btn-block btn-info col-md-3" id="printApz">
              Распечатать АПЗ
            </button>*/}
          </div>
          <div id="apz-detailed" className="col-md-3 apz-detailed card" style={{paddingTop: '10px'}}>
          </div>
        </div>
      </div>
    )
  }
}

/* <div className="container" style={rootStyle}>
        <form id="apzListByRegion" className="navbar-form">
          <label for="region" style={{marginRight:'5px'}}>Выберите район</label>
          <select name="region" className="form-control">
            <option>Наурызбай</option>
            <option>Алатау</option>
            <option>Алмалы</option>
            <option>Ауезов</option>
            <option>Бостандық</option>
            <option>Жетісу</option>
            <option>Медеу</option>
            <option>Турксиб</option>
          </select>
          <input type="submit" className="btn btn-info" value="Показать"/>
        </form>
        <div className="row">
          <div className="col-md-4 list">
            <h4 style={{textAlign:'center'}}>Список заявлений</h4>
          </div>
          <div className="col-md-4 detailed">
            <h4 style={{textAlign:'center'}}>Детальная форма</h4>
          </div>
          <div className="col-md-4 additional">
            <h4 id="actionsSubstitude" style={{textAlign:'center'}}>Действия</h4>
            <div id="actions" style={{display:'none'}} className="btn-group btn-group-justified">
              <a className="btn btn-success">Одобрить</a>
              <a className="btn btn-danger">Отклонить</a>
              <a className="btn btn-info">Отложить</a>
            </div>
                
          </div>
          <div id="localMap" className="col-md-12" style={{height:'200px',width:'100%'}}>
            hello local map
          </div>
        </div>
      </div> */